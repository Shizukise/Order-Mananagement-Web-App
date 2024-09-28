import React from "react";
import { Link } from "react-router-dom";
import './Managementnav.css'

const ManagementNav = () => {
    return (
            <nav id="ManagementNav"> 
                <Link className="mngmntnav mngmntnav-active" aria-current="page" to="/management">DashBoard</Link>
                <Link className="mngmntnav" to="#">Pending Orders</Link>
                <Link className="mngmntnav" to="#">Delivery</Link>
                <Link className="mngmntnav" to="#">Create order</Link>
            </nav>
    );
}

export default ManagementNav