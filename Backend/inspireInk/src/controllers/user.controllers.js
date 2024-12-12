import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
// import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
// import { DeleteCloudinaryAsset } from "../utils/deleteCloudinaryFiles.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
      const user = await User.findById(userId);
      
      const accessToken = user.generateAccessToken();
      
      const refreshToken = user.generateRefreshToken();

  
      user.RefreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        " Something went wrong while generating access token and refresh token"
      );
    }
  };
  const refreshaccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
  
    if (!incomingRefreshToken) {
      throw new ApiError(404, "unauthorized request");
    }
  
    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
  
      const user = await User.findById(decodedToken?._id);
  
      if (!user) {
        throw new ApiError(404, "invalid refresh token");
      }
  
      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(404, "Refresh token is expired or used");
      }
  
      const options = {
        httpOnly: true,
        secure: true,
      };
  
      const { accessToken, newrefreshToken } =
        await generateAccessAndRefreshToken(user._id);
  
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              refreshToken: newrefreshToken,
              accessToken,
            },
            "Access Token refreshed"
          )
        );
    } catch (error) {
      throw new ApiError(401, error?.message || "invalid refresh token");
    }
  });
  
  
const registerUser = asyncHandler(async (req, res) => {
  // Extracting data from the request body
  const { name, email, username, password, about } = req.body;

  // Validation: Check if all required fields are provided
  if (
    [name, email, username, password].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields must be provided");
  }

  // Check if the user already exists (by username or email)
  
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  // Handle avatar upload (if provided)
  let avatarUrl = "";
  // if (req.files?.avatar?.[0]?.path) {
  //   const avatar = await uploadCloudinary(req.files.avatar[0].path);
  //   avatarUrl = avatar.url;
  // }

  // Create user object and save to database
  const user = await User.create({
    // Unique userId generated based on timestamp
    name,
    email,
    username: username,
    password, // You might want to hash the password before saving it
    about: about || "",
    isAdmin: false, // Default value for isAdmin
    savedList: [],
    blogList: [],
    RefreshToken: null, // Default value for refresh token
    profilePicURL: avatarUrl, // Uploaded avatar URL
  });

  // Remove sensitive fields and retrieve created user
  const createdUser = await User.findById(user._id).select(
    "-password -RefreshToken"
  );

  // Check if user creation was successful and send response
  if (createdUser) {
    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User created successfully"));
  } else {
    throw new ApiError(500, "User creation failed");
  }
});



const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // Validate input: Ensure either email or username is provided
  if (!(email || username)) {
    throw new ApiError(400, "Username or Email is required");
  }

  // Find user by username or email
  const user = await User.findOne({
    $or: [{ username: username?.toLowerCase() }, { email }],
  });
  console.log(user);
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if the password is correct
  const isPasswordValid = await user.isPasswordCorrect(password); // Assuming you have a method `isPasswordCorrect` in your schema for password comparison
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

    // Generate Access Token and Refresh Token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // Save the Refresh Token in the database
    user.RefreshToken = refreshToken;
  await user.save();

  // Exclude sensitive data (password and RefreshToken) from the response
  const loggedInUser = await User.findById(user._id).select(
    "-password -RefreshToken"
  );
  // Set cookie options
    const options = {
      httpOnly: true, // Accessible only by the web server
      secure: process.env.NODE_ENV === "production", // Send over HTTPS in production
      sameSite: "Strict", // Strict CSRF protection
    };

  // Send response
  return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
      "User logged in successfully"
    )
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: "" },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getBlogs = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  try {
    // Find blogs where the author matches the given userId
    const blogs = await Blog.find({ author: userId });

    // Return the list of blogs
    return res.status(200).json(
      new ApiResponse(
        200,
        { blogs },
        "Successfully retrieved blog data"
      )
    );
  } catch (error) {
    // Handle any errors that occur
    return res.status(500).json(
      new ApiResponse(
        500,
        null,
        "Failed to retrieve blog data"
      )
    );
  }
});




const addBlogToUser = asyncHandler(async (req, res) => {
  const { UserId, title, content, category } = req.body; // Get data from request body
    // Step 1: Create a new blog
    const newBlog = new Blog({
      title,
      content,
      category,
      author: UserId, // Link the user to the blog
    });

    // Save the new blog post
    await newBlog.save();

    // Step 2: Find the user and add the blog ID to the blogList
    const user = await User.findById(UserId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.blogList.push(newBlog._id); // Add blog ID to the user's blogList

    // Save the updated user
    await user.save();

    // Step 3: Return a response
   return res.status(201)
      .json(new ApiResponse(201, {
        message: 'Blog added successfully to user',
        blog: newBlog,
        user: user,
      }, "User created successfully"));
  
});

export { registerUser, loginUser, logoutUser ,refreshaccessToken,getBlogs,addBlogToUser};


