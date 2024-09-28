import React from 'react';
import { AuthProvider } from './contexts/AuthContext'
import MainLoginDiv from './components/Login/Login';
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {
    return (
      <Router>
        <AuthProvider>
            <MainLoginDiv />
        </AuthProvider>
      </Router>
    );
};

export default App;
