import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UserTickets from './components/UserTickets';
import { useEffect, useState } from 'react';
import CreateTicket from "./components/CreateTicket";

function App() {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/tickets" element={authenticated ? <UserTickets /> : <Navigate to="/login" />} />
                <Route path="/create-ticket" element={authenticated ? <CreateTicket /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
