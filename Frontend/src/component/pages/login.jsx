import { Card, CardBody, CardHeader, Container, FormGroup, Input, Label, Form, Button, Row, Col } from "reactstrap";
import { useState ,useEffect} from "react";
import axios from "axios"; // Import axios for making HTTP requests
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./css/Login.css";
import { useUser } from "../../context/Usercontext";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const {toggleLogin,userId,setUserId}= useUser();
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    if (userId) {
      console.log("User ID updated:", userId);  // Check if userId is updated
      navigate("/"); // Redirect after updating userId
    }
  }, [userId, navigate]); 
  const resetData = () => {
    setData({
      email: "",
      password: "",
    });
  };
  

  const submitForm = async (e) => {
    e.preventDefault();
    // Form validation (optional)
    if (!data.email || !data.password) {
      toast.error("Please fill all the fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/v1/users/login", data); // Assuming backend is running on localhost:5000
    //   console.log(typeof response.data.data.user._id);
        if(response.status === 200){

            setUserId(response.data.data.user._id);
            toast.success(response.data.message);
            // console.log(userId);
            // navigate("/");
            // Assuming user id is stored in a field called _id in the user schema. Adjust as needed.
            toggleLogin(); 
        }
      // Redirect or store user data in context/state if required
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else {
        toast.error("Network error");
      }
    }
    resetData();
  };

  return (
    <>
      <div className="background">
        <Container className="pt-5">
          <Row>
            <Col sm={{ size: 6, offset: 3 }}>
              <Card color="dark" outline>
                <CardHeader className="text-center">
                  <h2>Login here!!</h2>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={submitForm}>
                    <FormGroup>
                      <Label for="email">Enter your Email</Label>
                      <Input
                        type="email"
                        placeholder="Enter here"
                        id="email"
                        onChange={handleInputChange}
                        value={data.email}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="password">Enter your password</Label>
                      <Input
                        type="password"
                        placeholder="Enter here"
                        id="password"
                        onChange={handleInputChange}
                        value={data.password}
                      />
                    </FormGroup>
                    <Container className="text-center">
                      <Button type="submit" color="dark">
                        Login
                      </Button>
                      <Button type="reset" color="secondary" className="ms-2">
                        Reset
                      </Button>
                    </Container>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Login;
