// App.js
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import MainLoginDiv from './components/Login/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ManagementDashboard from './components/OrderManagement/ManagementDashboard/MngmDashboard';
import Dashboard from './components/Dashboard/Dashboard';
import PendingOrders from './components/OrderManagement/PendingOrders/PendingOrders';
import ProtectedRoute from './components/ProtectedRoute';
import CreateOrder from './components/OrderManagement/CreateOrder/CreateOrder';
import OrderPage from './components/OrderManagement/OrderPage/OrderPage';
import ChatPage from './components/OrderManagement/OrderPage/ChatPage';
import Historic from './components/OrderManagement/OrderPage/HistoricPage';
import DeliveryPage from './components/OrderManagement/Delivery/DeliveryPage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<MainLoginDiv />} />
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>  {/* every protected route is wraped by ProtectedRoute component */}
          <Route path='/management' element={<ProtectedRoute><ManagementDashboard /></ProtectedRoute>}/>
          <Route path='/createorder' element={<ProtectedRoute><CreateOrder /></ProtectedRoute>}/>
          <Route path='/pendingorders' element={<ProtectedRoute><PendingOrders /></ProtectedRoute>}/>
          <Route path='/order/:orderId' element={<ProtectedRoute><OrderPage/></ProtectedRoute>}/>
          <Route path='/orderchat/:orderId' element={<ProtectedRoute><ChatPage/></ProtectedRoute>}/>
          <Route path='/orderhistoric/:orderId' element={<ProtectedRoute><Historic/></ProtectedRoute>}/>
          <Route path='/delivery' element={<ProtectedRoute><DeliveryPage/></ProtectedRoute>}/>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
