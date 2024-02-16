import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.css';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('/helpdesk-service/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (response.ok) {
                navigate('/login');
            } else {
                console.error('Ошибка выхода:', response.status);
            }
        } catch (error) {
            console.error('Ошибка выхода:', error);
        }
    };

    const handleCreateTicket = () => {
        navigate('/create-ticket');
    };

    return (
        <div className="header">
            <div>
                <Link to="/tickets" style={{ textDecoration: 'none' }}>
                    <h1> HelpDesk</h1>
                </Link>
            </div>
            <div>
                <button onClick={handleCreateTicket}>Create Ticket</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Header;
