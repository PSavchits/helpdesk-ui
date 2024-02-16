import React, { useEffect, useState, useRef } from 'react';
import Header from "../../components/Header/Header";
import {Link} from "react-router-dom";

const UserTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showMyTickets, setShowMyTickets] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const containerRef = useRef(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [showActions, setShowActions] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const url = showMyTickets ? `/helpdesk-service/tickets/myTickets?page=${page}` : `/helpdesk-service/tickets?page=${page}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tickets');
                }

                const data = await response.json();
                setTickets(prevTickets => [...prevTickets, ...data]);
                setHasMore(data.length > 0);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchTickets();
    }, [showMyTickets, page]);

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            if (scrollHeight - scrollTop === clientHeight && !loading && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        };

        if (containerRef.current) {
            containerRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (containerRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                containerRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [loading, hasMore]);

    const handleToggleMyTickets = () => {
        setShowMyTickets(!showMyTickets);
        setPage(0);
        setTickets([]);
    };

    const handleSort = (columnName) => {
        const newOrder = {
            column: columnName,
            order: sortOrder.column === columnName && sortOrder.order === 'asc' ? 'desc' : 'asc',
        };

        setSortOrder(newOrder);

        const sortedTickets = [...tickets].sort((a, b) => {
            if (columnName === 'id') {
                const numA = parseInt(a[columnName]);
                const numB = parseInt(b[columnName]);
                return newOrder.order === 'asc' ? numA - numB : numB - numA;
            } else {
                const valueA = String(a[columnName]);
                const valueB = String(b[columnName]);
                return newOrder.order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            }
        });

        setTickets(sortedTickets);
    };

    const handleSortByDate = (ascending) => {
        const sortedTickets = [...tickets].sort((a, b) => {
            const dateA = new Date(a.desiredResolutionDate);
            const dateB = new Date(b.desiredResolutionDate);

            if (ascending) {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });

        setTickets(sortedTickets);
    };

    if (loading && page === 0) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredTickets = tickets.filter(ticket =>
        (ticket.name && ticket.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ticket.id && ticket.id.toString().includes(searchTerm.toLowerCase())) ||
        (ticket.desiredResolutionDate && ticket.desiredResolutionDate.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ticket.urgency && ticket.urgency.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ticket.state && ticket.state.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const changeTicketState = async (id, newState) => {
        try {
            const response = await fetch(`/helpdesk-service/tickets/changeTicketState`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({ id, newState }),
            });

            if (response.ok) {
                setPage(0);
                setTickets([]);
            }


        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleActionsDropdown = (ticketId) => {
        setSelectedTicketId(ticketId);
        setShowActions(!showActions);
    };

    return (
        <div>
            <Header />
            <div style={{ textAlign: 'center' }} ref={containerRef}>
                <h2>{showMyTickets ? 'My Tickets' : 'All Tickets'}</h2>
                <button onClick={handleToggleMyTickets}>{showMyTickets ? 'All Tickets' : 'My Tickets'}</button>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ marginBottom: '10px' }}
                />
                <table border="1" style={{ margin: '0 auto' }}>
                    <thead style={{ backgroundColor: 'lightblue'}}>
                    <tr>
                        <th>
                            ID
                            <span className="sort-arrow" onClick={() => handleSort('id')}>{sortOrder.order === 'asc' ? '▲' : '▼'}</span>
                        </th>
                        <th>
                            Name
                            <span className="sort-arrow" onClick={() => handleSort('name')}>{sortOrder.order === 'asc' ? '▲' : '▼'}</span>
                        </th>
                        <th>
                            Desired Date
                            <span className="sort-arrow"  onClick={() => handleSortByDate(true)}>▲</span>
                            <span className="sort-arrow"  onClick={() => handleSortByDate(false)}>▼</span>
                        </th>
                        <th>Urgency</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTickets.map(ticket => (
                        <tr key={ticket.id}>
                            <td>{ticket.id}</td>
                            <td>
                                <Link to={`/overview/${ticket.id}`}>{ticket.name}</Link></td>
                            <td>{ticket.desiredResolutionDate}</td>
                            <td>{ticket.urgency}</td>
                            <td>{ticket.state}</td>
                            <td>
                                <div className="dropdown">
                                    <button className="dropbtn" onClick={() => toggleActionsDropdown(ticket.id)}>Actions</button>
                                    {selectedTicketId === ticket.id && showActions && (
                                        <div className="dropdown-content">
                                            {ticket.state === 'DRAFT' || ticket.state === 'CANCELED' ? (
                                                <>
                                                    <button className="submit-button action-button" onClick={() => changeTicketState(ticket.id, 'NEW')}>Submit</button>
                                                    <button className="cancel-button action-button" onClick={() => changeTicketState(ticket.id, 'CANCELED')}>Cancel</button>
                                                </>
                                            ) : ticket.state === 'APPROVED' ? (
                                                <>
                                                    <button className="submit-button action-button" onClick={() => changeTicketState(ticket.id, 'NEW')}>Submit</button>
                                                    <button className="submit-button action-button" onClick={() => changeTicketState(ticket.id, 'DONE')}>Done</button>
                                                    <button className="submit-button action-button" onClick={() => changeTicketState(ticket.id, 'IN_PROGRESS')}>Assign to Me</button>
                                                    <button className="cancel-button action-button" onClick={() => changeTicketState(ticket.id, 'CANCELED')}>Cancel</button>
                                                </>
                                            ) : ticket.state === 'NEW' ? (
                                                <>
                                                    <button className="submit-button action-button" onClick={() => changeTicketState(ticket.id, 'IN_PROGRESS')}>Assign to Me</button>
                                                    <button className="cancel-button action-button" onClick={() => changeTicketState(ticket.id, 'CANCELED')}>Cancel</button>
                                                </>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                end..
            </div>
        </div>
    );
};

export default UserTickets;
