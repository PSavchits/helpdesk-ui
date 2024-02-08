import React, { useState } from 'react';
import UserTickets from "./UserTickets";
import {useNavigate} from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/helpdesk-service/auth/authenticate', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                if (token) {
                    localStorage.setItem('accessToken', token);
                    localStorage.setItem('token', token);
                    console.log('Token saved:', token);

                    const request = window.indexedDB.open('Tokens', 1);
                    request.onupgradeneeded = function () {
                        const db = request.result;
                        const tokens = db.createObjectStore('tokens', { keyPath: 'id' });
                    };
                    request.onsuccess = function () {
                        const db = request.result;
                        const transaction = db.transaction('tokens', 'readwrite');
                        const tokens = transaction.objectStore('tokens');

                        const existingToken = tokens.get(1);
                        existingToken.onsuccess = function () {
                            if (existingToken.result) {
                                existingToken.result.value = token;
                                tokens.put(existingToken.result);
                            } else {
                                tokens.put({ id: 1, value: token });
                            }

                            transaction.oncomplete = function () {
                                db.close();
                                setAuthenticated(true);
                                navigate('/tickets');
                            };
                        };
                    };
                } else {
                    console.error('Token not found in the response');
                }
            } else {
                if (response.status === 500 || response.status === 403) {
                    window.location.href = '/login?error';
                } else {
                    console.error('Authentication failed');
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (authenticated) {
        return <UserTickets />;
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={submitForm}>
                <div>
                    <label>Email:</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
