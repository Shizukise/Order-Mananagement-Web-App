import Navbar from "../Navbar/Navbar";
import './Login.css'
import { useAuth } from "../../contexts/AuthContext";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


/* import { Link } from "react-router-dom"; */


const MainLoginDiv = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()


    const handleSubmit = async(e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/loginuser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username, password}),
            credentials: 'include'

        });

        if (response.ok) {
            const userData = await response.json();
            login(userData.user);
            console.log(userData)
            console.log(`Logged in ${userData.user}`)
            navigate('/dashboard')
        } else {
            //pop up login modal error
            console.error('Login failed');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);  // Call handleSubmit when Enter is pressed
        }
    };

    return (
        <>
            <Navbar />
            <div id="MainLoginContainer">
                <div id="MainLoginDiv">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="inputUsername5" className="form-label">User</label>
                        <input className="form-control" type="text" 
                                aria-label="default input example" id="inputUsername5"
                                value={username} onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={handleKeyDown}
                                required/>
                        <label htmlFor="inputPassword5" className="form-label">Password</label>
                        <input type="password" id="inputPassword5" className="form-control" 
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                required/>
                    </form>
                </div>
            </div>
        </>
    )
};




export default MainLoginDiv