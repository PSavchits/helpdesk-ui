import React, { useState } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Header from "../../components/Header/Header";

function EditTicket() {
    const navigate = useNavigate();

    const [category, setCategory] = useState('Application & Services');
    const [name, setName] = useState('');
    const { id } = useParams();
    const [description, setDescription] = useState('');
    const [urgency, setUrgency] = useState('CRITICAL');
    const [desiredResolutionDate, setDesiredResolutionDate] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [commentText, setCommentText] = useState('');

    const handleFileChange = (event) => {
        setAttachments(event.target.files);
    };

    const handleSubmit = async (event, ticketState) => {
        event.preventDefault();

        const ticketDTO = {
            category: category,
            name: name,
            description: description,
            urgency: urgency,
            state: ticketState,
            desiredResolutionDate: desiredResolutionDate,
            commentText: commentText,
        };

        const ticket = new Blob([JSON.stringify(ticketDTO)], { type: 'application/json' });
        const formData = new FormData();
        formData.append('ticketDTO', ticket);

        for (let i = 0; i < attachments.length; i++) {
            formData.append('attachments', attachments[i]);
        }

        try {
            const response = await fetch(`/helpdesk-service/tickets/${id}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            navigate('/tickets');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <Header />
            <div className="create-ticket">
                <h1>Edit Ticket</h1>
                <form>
                    <div className="form-group">
                        <label htmlFor="category" className="required">Category</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                            <option value="Application & Services">Application & Services</option>
                            <option value="Benefits & Paper Work">Benefits & Paper Work</option>
                            <option value="Hardware & Software">Hardware & Software</option>
                            <option value="People Management">People Management</option>
                            <option value="Security & Access">Security & Access</option>
                            <option value="Workplaces & Facilities">Workplaces & Facilities</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="required">Description</label>
                        <textarea id="description" name="description" rows="4" onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name" className="required">Name</label>
                        <input type="text" id="name" name="name" onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="urgency" className="required">Urgency</label>
                        <select id="urgency" name="urgency" onChange={(e) => setUrgency(e.target.value)} required>
                            <option value="CRITICAL">Critical</option>
                            <option value="HIGH">High</option>
                            <option value="AVERAGE">Average</option>
                            <option value="LOW">Low</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="desiredResolutionDate" className="required">Desired Resolution Date</label>
                        <input type="date" id="desiredResolutionDate" name="desiredResolutionDate" onChange={(e) => setDesiredResolutionDate(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="attachments">Add attachments</label>
                        <input type="file" id="attachments" name="attachments" multiple accept=".pdf, .doc, .docx, .png, .jpeg, .jpg" onChange={handleFileChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="commentText">Comment</label>
                        <textarea id="commentText" name="commentText" rows="3" value={commentText} onChange={(e) => setCommentText(e.target.value)}></textarea>
                    </div>

                    <button className="submit-button" onClick={(e) => handleSubmit(e, 'NEW')}>Submit</button>
                    <button className="draft-button" onClick={(e) => handleSubmit(e, 'DRAFT')}>Save as Draft</button>
                </form>
            </div>
        </div>
    );
}

export default EditTicket;