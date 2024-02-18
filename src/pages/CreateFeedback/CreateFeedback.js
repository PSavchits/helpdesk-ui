import React, { useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Header from '../../components/Header/Header';
import './CreateFeedback.css';

const CreateFeedback = ({ ticketId }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');

    const handleRate = (stars) => {
        setRating(stars);
    };

    const handleSubmitFeedback = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem('accessToken');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const feedbackData = {
                rate: rating,
                text: feedbackText,
                ticketId: parseInt(id)
            };

            const response = await fetch('/helpdesk-service/feedback', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(feedbackData)
            });

            if (!response.ok) {
                navigate('/login');
            }

            navigate('/tickets');
        } catch (error) {
            navigate('/login');
        }
    };

    const handleGoBack = () => {
        navigate('/tickets');
    };

    return (
        <div>
            <Header />
            <div className="create-feedback">
                <h2>Ticket ({id})</h2>
                <a href="#" className="logo-1" onClick={handleGoBack}>Back</a>
                <label>Please, rate your satisfaction with the solution:</label>
                <div>
                    {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={`star ${star <= rating ? 'checked' : ''}`} onClick={() => handleRate(star)}>★</span>
                    ))}
                </div>
                <div>
                    <label htmlFor="feedbackText">Leave Comment if needed:</label>
                    <textarea id="feedbackText" rows="4" cols="50" value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)}></textarea>
                </div>
                <button id="submitFeedbackButton" onClick={handleSubmitFeedback}>Submit Feedback</button>
            </div>
        </div>
    );
};

export default CreateFeedback;
