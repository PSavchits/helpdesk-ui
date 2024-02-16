import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import './OverviewTicket.css';

const OverviewTicket = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [ticketData, setTicketData] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [commentData, setCommentData] = useState([]);
    const [attachmentData, setAttachmentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const headers = {
                    'Authorization': `Bearer ${token}`
                };
                const response = await axios.get(`/helpdesk-service/tickets/overview/${id}`, { headers });
                setTicketData(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching ticket data');
                setLoading(false);
            }
        };

        const fetchHistoryData = async () => {
            try {
                const response = await axios.get(`/history-service/histories/${id}`);
                setHistoryData(response.data);
            } catch (error) {
                console.error('Error fetching history data', error);
            }
        };

        const fetchCommentsData = async () => {
            try {
                const response = await axios.get(`/helpdesk-service/comments/${id}`);
                setCommentData(response.data);
            } catch (error) {
                console.error('Error fetching comments data', error);
            }
        };

        const fetchAttachmentsData = async () => {
            try {
                const response = await axios.get(`/helpdesk-service/attachments/show/${id}`);
                setAttachmentData(response.data);
            } catch (error) {
                console.error('Error fetching attachments data', error);
            }
        };

        fetchTicketData();
        fetchHistoryData();
        fetchCommentsData();
        fetchAttachmentsData();
    }, [id]);

    const handleCreateTicket = () => {
        navigate('/tickets');
    };

    const handleCreateFeedback = () => {
        const url = `/add-feedback/${ticketData.id}`;
        navigate(url);
    };

    const handleToggleComments = () => {
        setShowComments(!showComments);
    };

    const handleChangeNewComment = (event) => {
        setNewComment(event.target.value);
    };

    const handleEditTicket = () => {
        const url =`/edit-ticket/${ticketData.id}`;
        navigate(url);
    };

    const handleSubmitComment = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('accessToken');
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            await axios.post(`/helpdesk-service/comments`, { text: newComment, ticketId: id }, { headers });
            const response = await axios.get(`/helpdesk-service/comments/${id}`);
            setCommentData(response.data);
            setNewComment('');
        } catch (error) {
            console.error('Error submitting comment', error);
        }
    };

    const handleDownloadAttachment = async (attachmentId) => {
        try {
            const response = await axios.get(`/helpdesk-service/attachments/${attachmentId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', attachmentData.find(attachment => attachment.id === attachmentId).name);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading attachment', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Header />
            <div className="overview-ticket">
                <div>
                    <button className="overview-ticket-button" onClick={handleCreateTicket}>Back</button>
                    {ticketData.state === 'DONE' && (
                        <button className="overview-ticket-button" onClick={handleCreateFeedback}>Leave Feedback</button>
                    )}
                    {ticketData.state === 'DRAFT' && (
                        <button className="overview-ticket-button" onClick={handleEditTicket}>Edit Ticket</button>
                    )}
                </div>
                <h1>Ticket Overview</h1>
                <h2>Ticket ({ticketData.id}) - {ticketData.name}</h2>
                <div className="overview-ticket-info overview-ticket-div">
                    {ticketData && (
                        <div className="overview-ticket-div">
                            <p>ID: {ticketData.id}</p>
                            <p>Name: {ticketData.name}</p>
                            <p>Description: {ticketData.description}</p>
                            <p>Urgency: {ticketData.urgency}</p>
                            <p>State: {ticketData.state}</p>
                        </div>)}
                    <div className="overview-ticket-div">
                        <p>Category: {ticketData.category}</p>
                        <p>Approver: {ticketData.approver}</p>
                        <p>Owner: {ticketData.owner}</p>
                        <p>Assignee: {ticketData.assignee}</p>
                        <p>Desired Resolution Date: {ticketData.desiredResolutionDate}</p>
                    </div>
                </div>
                <div id="attachmentsSection" className="overview-ticket-div overview-ticket-info">
                    <h2>Attachments</h2>
                    <ul>
                        {attachmentData.map(attachment => (
                            <li key={attachment.id}>
                                <span>{attachment.name}</span>
                                <button className="overview-ticket-button" onClick={() => handleDownloadAttachment(attachment.id)}>Download</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div id="historyTable" className="table-container overview-ticket-div">
                    <h2>History</h2>
                    <table className="overview-ticket-table">
                        <thead>
                        <tr className="overview-ticket-tr">
                            <th className="overview-ticket-th">Date</th>
                            <th className="overview-ticket-th">Action</th>
                            <th className="overview-ticket-th">Details</th>
                        </tr>
                        </thead>
                        <tbody className="overview-ticket-tbody">
                        {historyData.map(history => (
                            <tr className="overview-ticket-tr" key={history.id}>
                                <td className="overview-ticket-td">{history.created}</td>
                                <td className="overview-ticket-td">{history.action}</td>
                                <td className="overview-ticket-td">{history.description}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div id="commentsSection" className="overview-ticket-div">
                    <h2>Comments</h2>
                    <button onClick={handleToggleComments}>
                        {showComments ? 'Hide Comments' : 'Show Comments'}
                    </button>
                    {showComments && (
                        <>
                            <table className="overview-ticket-table">
                                <thead>
                                <tr className="overview-ticket-tr">
                                    <th className="overview-ticket-th">Date</th>
                                    <th className="overview-ticket-th">User</th>
                                    <th className="overview-ticket-th">Comment</th>
                                </tr>
                                </thead>
                                <tbody className="overview-ticket-tbody">
                                {commentData.map(comment => (
                                    <tr className="overview-ticket-tr" key={comment.id}>
                                        <td className="overview-ticket-td">{comment.date}</td>
                                        <td className="overview-ticket-td">{comment.user.firstname}</td>
                                        <td className="overview-ticket-td">{comment.text}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <form onSubmit={handleSubmitComment}>
                                <label htmlFor="newComment">New Comment:</label>
                                <textarea id="newComment" value={newComment} onChange={handleChangeNewComment} />
                                <button type="submit">Add Comment</button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OverviewTicket;

