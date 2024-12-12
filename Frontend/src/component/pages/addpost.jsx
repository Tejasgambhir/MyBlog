import React, { useRef } from 'react'
import { Card, CardBody, Input,Form, Label, Button, Container } from 'reactstrap'
import JoditEditor from 'jodit-react'
import { useState ,useEffect} from 'react';
import { toast } from 'react-toastify';
import axios from "axios";
import { useUser } from '../../context/Usercontext';
export default function Addpost() {
    
    
    const editor  = useRef(null);
    const [content,setContent] = useState('')
    const [blog  , setBlog] = useState({
        UserId:'',
        title:'',
        content:'',
        category:'',
    })
    const {userId} = useUser();

    const fieldchange = (event)=>{
        // console.log(post);
        if (typeof event === "string") {
            
            setBlog({...blog, "content" : event})
        } 
        else{
            setBlog({...blog, [event.target.name] : event.target.value})
        }
    } 
   
    const createPost =async (event) => {
        event.preventDefault();
        const blogWithUserId = { ...blog, UserId: userId };
        // console.log(blogWithUserId);

        
        try {
          // Send the blog post data to your backend
          const response = await axios.post("http://localhost:8080/api/v1/users/add-blog", blogWithUserId);

          // Handle success response
          if (response.status === 201) {
            toast.success("Post is successfully created");
          } else {
            toast.error("Failed to create post");
          }
        } catch (error) {
          console.error("Error creating post:", error);
          toast.error("An error occurred while creating the post");
        }
      };
    // useEffect(() => { 
        //     localStorage.setItem("Username",JSON.stringify(userName))
        //     });
        return (
            <div className='container mt-2'>
      <Card className='p-2 shadow'>
        <h2>What going  in your mind</h2>
        <CardBody>
            <Form onSubmit={createPost}>
                <div className='my-2'>
                    <Label>Post title</Label>
                    <Input type='text'
                    placeholder='Enter here'
                    name='title'
                    onChange={fieldchange}
                    ></Input>
                </div>
                <div className='my-2'>
                    <Label>Post content</Label>
                    {/* <Input type='textarea'
                    placeholder='Enter here'
                    style={{height:"200px"}}
                    ></Input> */}
                    <JoditEditor
                    ref={editor}
                    value = {blog.content}
                    onChange ={fieldchange}
                    />
                </div>
                <div>
                    <Label>Category</Label>
                <Input
                        id="exampleSelect"
                        name="category"
                        type="select"
                        onChange={fieldchange}
                        >
                        <option disabled selected="true">-- select the category -- </option>
                        <option>
                            programming
                        </option>
                        <option>
                            World affair
                        </option>
                        
                </Input>
                </div>
                <Container className='text-center my-3'>
                    <Button type='submit' color='dark' >Create post</Button>
                    <Button type = 'reset' color='secondary' className=' ms-2'>Reset Content</Button>
                </Container>
            </Form>
        </CardBody>
      </Card>
    </div>
  )
}