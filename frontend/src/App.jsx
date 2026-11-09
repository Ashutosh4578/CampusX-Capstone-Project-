
import React from 'react';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {

    const token = localStorage.getItem('token');

    const role = localStorage.getItem('role');

    const validRoles = [
        'ADMIN',
        'FACULTY',
        'STUDENT'
    ];

    if (!token || !validRoles.includes(role)) {

        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');

        return <Navigate to="/login" replace />;

    }

    return children;

};

function App() {

    return (

        <Router>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>

        </Router>

    );

}

export default App;
