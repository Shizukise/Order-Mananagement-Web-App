// PrivateRoute.js (Updated to ProtectedDashBoard)
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    // If user is logged in, render the child components (protected route)
    // If not, redirect to login
    return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;

//This can be used to wrap any component we want to be acessed only by authenticated users
