import {Card, CardBody, CardHeader, Container, FormGroup, Input, Label ,Form, Button, Row,Col} from "reactstrap";
import { useState } from "react";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./css/Signup.css"
import axios from 'axios';
const Signup = ()=>{

const[data,setData]=useState({
    username:"",
    name:"",
    email:"",
    password:"",
})
    const handleClick =(event)=>{
        setData({...data , [event.target.id]:event.target.value});        
    }
    const resetData = ()=>{
            setData({
                username:"",
                name:"",
                email:"",
                password:"",
            })
    }
    

const submitForm = async (e) => {
  e.preventDefault();

  try {
    // Send POST request to the backend
    const response = await axios.post('http://localhost:8080/api/v1/users/register', data);
    console.log(response);
    
    // Handle success
    toast.success(response.data.message);
    resetData();
  } catch (error) {
    // Handle errors
    if (error.response && error.response.data) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Something went wrong. Please try again later.');
    }
  }
};


    return(
        <>
       <div className="background">

       <Container className="pt-5">
       <Row>
        <Col sm={{size:6,offset:3}}>
            
            <Card color="dark" outline>
             <CardHeader>
                <h2>Fill the registration form</h2>
            </CardHeader>
            <CardBody>
                <Form onSubmit={submitForm}>
                    <FormGroup>
                       <Label for= "Name">Enter your Name</Label>
                       <Input
                       type ="text"
                       placeholder="Enter here"
                       id="name"
                       onChange={(e)=>{handleClick(e)}}
                       value={data.name}
                       />
                    </FormGroup>
                    <FormGroup>
                       <Label for= "Name">UserName</Label>
                       <Input
                       type ="text"
                       placeholder="Enter here"
                       id="username"
                       onChange={(e)=>{handleClick(e)}}
                       value={data.username}
                       />
                    </FormGroup>
                    <FormGroup>
                       <Label for= "Email">Enter your Email</Label>
                       <Input
                       type ="email"
                       placeholder="Enter here"
                       id="email"
                       onChange={(e)=>{handleClick(e)}}
                       value={data.email}
                       required
                       />
                    </FormGroup>
                    <FormGroup>
                       <Label for= "password">Enter your password</Label>
                       <Input
                       type ="password"
                       placeholder="Enter here"
                       id="password"
                       onChange={(e)=>{handleClick(e)}}
                       value={data.password}required
                       />
                    </FormGroup>
                    <Container className = "text-center">
                        <Button type = "submit" color="dark">Register</Button>
                        <Button onClick={resetData} type = "reset" color="secondary" className="ms-2">Reset</Button>
                    </Container>
                </Form>
            </CardBody>
        </Card>
        </Col>
       </Row>
       </Container>
    </div>
       </>
       
    )             
}
export default  Signup;