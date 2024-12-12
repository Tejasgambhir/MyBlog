import { Container,Input,CardBody,CardTitle,CardSubtitle,Button ,CardText, Card, Row, Col, CardGroup, Label} from "reactstrap";
import "./css/Home.css"
import { Link } from "react-router-dom";
import Head from "./Head";
import Post from "./Post";
import { toast } from "react-toastify";
import { useState,useEffect} from 'react';
import axios from "axios";
import { useUser } from "../../context/Usercontext";
const Home = ()=>{
    const {userId} = useUser();
    const [array, setArray] = useState([{
        title:'',
        content:'',
        category:'',
        flag:  0}])
    
    const HandleAll = async()=>{
        try {
            const response = await axios.post("http://localhost:8080/api/v1/users/fetch-blog",{
                userId: userId
            });
            console.log(response.data.data.blogs);
            setArray(response.data.data.blogs);

        } catch (error) {
            console.error("Error creating post:", error);
          toast.error("An error occurred while fetching the post")
        }
    }

const Handleclick =(e)=>{
    let Temp = e.target.id;
    const FilterArray = array.filter((Element)=>{
        return (Element.category === Temp)
    })
    setArray(FilterArray);
}


    return(
        <div>
        
        <Head/>
        {/* Search bar , add button */}
        <Container className="mt-5" style={{width:"30vw"}}>
                <Container className="mb-4 text-center">
                    <h2>Search Blog here </h2>
                </Container>
                <div className="d-flex">
                    <button className="btn rounded-0 btn-outline-primary  shadow-none"><ion-icon name="search-outline"></ion-icon></button>
                    <Input type="text"
                    style={{borderRadius:"0"}}
                    >
                    
                    </Input>
                    <Link to='/addpost' className="btn btn-primary rounded-0"><ion-icon name="add-outline"></ion-icon></Link>
                </div>
            </Container>
            <Container className="mt-4">

            <Button color="primary" id="ALL" onClick={HandleAll}>ALL</Button>
            <Button className="ms-2" color="primary" id="programming" onClick={Handleclick}>Programming</Button>
            <Button className="ms-2" id="World affair" color="primary" onClick={Handleclick}>World Affair</Button>
            </Container>
            {/* Blogs*/}
            <Container className="mt-5 " style={{display:"flex", flexWrap:"wrap"}}>
                <Row>

                        {
                            array.map((Element)=>{
                                return  (<Post post = {Element}/>)
                            })
                        }
                </Row>
            </Container>
           {/* <Post/> */}
           </div>
           
           )    
        }
 export default Home ;