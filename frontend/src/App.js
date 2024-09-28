// App.js
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import MainLoginDiv from './components/Login/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ManagementDashboard from './components/OrderManagement/ManagementDashboard/MngmDashboard';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CreateOrder from './components/OrderManagement/CreateOrder/CreateOrder';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<MainLoginDiv />} />
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>  {/* every protected route is wraped by ProtectedRoute component */}
          <Route path='/management' element={<ProtectedRoute><ManagementDashboard /></ProtectedRoute>}/>
          <Route path='/createorder' element={<ProtectedRoute><CreateOrder /></ProtectedRoute>}/>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
