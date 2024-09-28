import React from "react";
import { Link } from "react-router-dom";
import './Managementnav.css'
import Navbar from "../../Navbar/Navbar";

const ManagementNav = () => {
    return (
        <>
            <Navbar />
            <nav id="ManagementNav"> 
                <Link className="mngmntnav mngmntnav-active" aria-current="page" to="/management">DashBoard</Link>
                <Link className="mngmntnav" to="#">Pending Orders</Link>
                <Link className="mngmntnav" to="#">Delivery</Link>
                <Link className="mngmntnav" to="/createorder">Create order</Link>
            </nav>
        </>
    );
}

export default ManagementNav