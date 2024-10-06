import React from "react";
import './Navbar.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


const Navbar = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        const response = await fetch('http://localhost:5000/logoutuser', {
            method: 'POST',
            credentials: 'include', //important so that flask login handles logout and cookie removal
        });
    
        if (response.ok) {
            navigate('/')
            window.location.reload();
        } else {
            console.error('Logout failed');
        }
    };

    if (user) {
        return (
            <nav className="navbar navbar-expand-lg bg-body-tertiary" id="MainNavbar">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/dashboard">Enterprise Brand</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/management">Orders Management</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="#">Statistics</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" to="#">
                                    USERTEAMSL
                                </Link>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><Link className="dropdown-item" to="#">{user}</Link></li>
                                    <li><Link className="dropdown-item" to="#">Teams</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link className="dropdown-item" to="#" onClick={() => handleLogout()}>Logoff</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    } else {
        return (
            <nav className="navbar navbar-expand-lg bg-body-tertiary" id="MainNavbar">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="#">Enterprise Brand</Link>
                </div>
            </nav>
        );

    }
};

export default Navbar;
