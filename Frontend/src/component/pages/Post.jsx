import { Container,Row,Col,Card,CardBody,CardTitle,CardSubtitle,Button,CardText } from "reactstrap"
import {Markup} from 'interweave'
import { Link } from "react-router-dom";
const Post = ({post={title:"This is default title",content:"This is default content"}})=>{
    return (
        <>
          <Col>
              <Card style={{width:"25vw" ,margin:"1rem"}}>
                  <img src="https://picsum.photos/300/200"></img>
                  <CardBody>
                              <CardTitle tag="h5">
                              {post.title}
                              </CardTitle>
                              
                              <Markup content={post.content.substring(0,200)} />
                              <Link to='/post' className="btn btn-secondary">
                              Read more
                              </Link>
                  </CardBody>
              </Card>
           </Col>    
        </>

    )
}
export default Post;