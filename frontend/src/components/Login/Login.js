import Navbar from "../Navbar/Navbar";
import './Login.css'


/* import { Link } from "react-router-dom"; */


const MainLoginDiv = () => {
    return (
        <>
            <Navbar />
            <div id="MainLoginContainer">
                <div id="MainLoginDiv">
                    <label htmlFor="inputUsername5" className="form-label">User</label>
                    <input className="form-control" type="text" placeholder=">" aria-label="default input example" id="inputUsername5" />
                    <label htmlFor="inputPassword5" className="form-label">Password</label>
                    <input type="password" id="inputPassword5" className="form-control" placeholder=">" aria-describedby="passwordHelpBlock" />
                </div>
            </div>
        </>
    )
}




export default MainLoginDiv