import React from 'react';
import { AuthProvider } from './contexts/AuthContext'
import MainLoginDiv from './components/Login/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashBoard from './components/Dashboard/Dashboard';

const App = () => {
    return (
      <Router>
        <AuthProvider>
            <Routes>
              <Route exact path='/' Component={MainLoginDiv} />
              <Route path='/dashboard' Component={DashBoard} />
            </Routes>            
        </AuthProvider>
      </Router>
    );
};

export default App;
