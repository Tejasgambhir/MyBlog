
import CustomNavbar from "./CustomNavbar";
const Base = ({children})=>{
    return (
        <div >
             <CustomNavbar></CustomNavbar>
             {children}
        </div>
    )
}
export default Base;