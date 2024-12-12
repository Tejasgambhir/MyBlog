import { BrowserRouter, NavLink,Link,Route,Routes } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";
import Home from "./home";
import Addpost from "./addpost";
import { useState } from "react";
import { Button } from "reactstrap";
import Postpage from "./Postpage";
import axios from "axios";
import { useUser } from "../../context/Usercontext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function Navbar() {
  const [isopen, setIsopen] = useState("false");
  const { isLoggedIn, toggleLogin } = useUser();
  const navigate = useNavigate();
  const Logout = async () => {
    try {
      await axios.post("http://localhost:8080/api/v1/users/logout");
      toast.success("Logged out successfully!");
      toggleLogin(); 
      navigate("/login") // Redirect to login
    } catch (error) {
      toast.error("Logout failed!");
    }
  };
  return (
    <>

 
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="container-fluid">
    
    <a to='/' className="navbar-brand" href="#">MyBlog</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" onClick = {()=>{setIsopen(!isopen)}}data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded ={isopen} aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className={isopen ? "collapse navbar-collapse" : "collapse navbar-collapse show"} id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link tag={NavLink} className="nav-link" to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link " to= "/login">About</Link>
        </li>
        {/* <li className="nav-item">
          <Link className="nav-link active" to= "/signup">signup</Link>
        </li> */}
        <li className="nav-item">
          <a className="nav-link" href="#"></a>
        </li>
      </ul>

     { isLoggedIn ? 
     <div class="navbar-text">
       <Button color="light" className="ms-2" onClick={Logout}> <Link style ={{color:"black"}}className="nav-link active" to= "/">Logout</Link></Button>
      </div> : 
        <div className="navbar-text">
          <Button color="light" className="ms-2"> <Link style ={{color:"black"}}className="nav-link active" to= "/login">Login</Link></Button>
          <Button color="light" className="ms-2"> <Link style ={{color:"black"}}className="nav-link active" to= "/signup">Signup</Link></Button>
        </div>
      }
    </div>
       
  </div>
</nav>
     
    </div>
    
    <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/addpost' element={<Addpost/>}/>
          <Route path='/post' element={<Postpage/>}/>
    </Routes>
    </>
  );
}

export default Navbar;