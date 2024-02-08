import React from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div style={{ backgroundColor: 'dodgerblue', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <h1 style={{ margin: '30px', color: 'white' }}>HelpDesk</h1>
            </div>
            <div>
                <button onClick={handleCreateTicket} style={{ backgroundColor: 'transparent', border: 'none', color: 'white', margin: '35px', cursor: 'pointer', fontSize: 'larger' }}>Create Ticket</button>
                <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: 'none', color: 'white', margin: '35px', cursor: 'pointer', fontSize: 'larger' }}>Logout</button>
            </div>
        </div>
    );
};

export default Header;
