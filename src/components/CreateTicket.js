import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import Header from "./Header";


function CreateTicketPage() {
    const navigate = useNavigate();

    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [urgency, setUrgency] = useState('');
    const [desiredResolutionDate, setDesiredResolutionDate] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [commentText, setCommentText] = useState('');

    const handleFileChange = (event) => {
        const files = event.target.files;
        setAttachments(files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('category', category);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('urgency', urgency);
        formData.append('desiredResolutionDate', desiredResolutionDate);
        for (let i = 0; i < attachments.length; i++) {
            formData.append('attachments', attachments[i]);
        }
        formData.append('commentText', commentText);
        formData.append('ticketState', 'NEW')

        try {
            const response = await fetch('/helpdesk-service/tickets', {
                method: 'POST',
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
            <div style={{ textAlign: 'center' }}>
            <h1>Create New Ticket</h1>
            <form onSubmit={handleSubmit} >
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
                    <label htmlFor="name" className="required">Name</label>
                    <input type="text" id="name" name="name" onChange={(e) => setName(e.target.value)} required/>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" rows="4" onChange={(e) => setDescription(e.target.value)}></textarea>
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
                    <label htmlFor="desiredResolutionDate">Desired Resolution Date</label>
                    <input type="date" id="desiredResolutionDate" name="desiredResolutionDate" onChange={(e) => setDesiredResolutionDate(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="attachments">Add attachments</label>
                    <input type="file" id="attachments" name="attachments" multiple accept=".pdf, .doc, .docx, .png, .jpeg, .jpg" onChange={handleFileChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="commentText">Comment</label>
                    <textarea id="commentText" name="commentText" rows="3" value={commentText} onChange={(e) => setCommentText(e.target.value)}></textarea>
                </div>

                <input type="submit" value="Submit" />
            </form>
            </div>
        </div>
    );
}

export default CreateTicketPage;
