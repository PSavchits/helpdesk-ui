import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import UserTickets from './pages/UserTickets/UserTickets';
import { useEffect, useState } from 'react';
import CreateTicket from "./pages/CreateTicket/CreateTicket";
import OverviewTicket from "./pages/OverviewTicket/OverviewTicket";
import CreateFeedback from "./pages/CreateFeedback/CreateFeedback";
import EditTicket from "./pages/EditTicket/EditTicket";

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
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/tickets" element={authenticated ? <UserTickets /> : <Navigate to="/login" />} />
                <Route path="/create-ticket" element={authenticated ? <CreateTicket /> : <Navigate to="/login" />} />
                <Route path="/edit-ticket/:id" element={authenticated ? <EditTicket /> : <Navigate to="/login" />} />
                <Route path="/overview/:id" element={authenticated ? <OverviewTicket /> : <Navigate to="/login" />} />
                <Route path="/add-feedback/:id" element={authenticated ? <CreateFeedback /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
