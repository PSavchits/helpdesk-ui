
import React, { useEffect, useState } from 'react';import Header from "./Header";

const UserTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showMyTickets, setShowMyTickets] = useState(false);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const url = showMyTickets ? '/helpdesk-service/tickets/myTickets' : '/helpdesk-service/tickets';
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
                setTickets(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchTickets();
    }, [showMyTickets]);

    const handleSort = (columnName) => {
        const newOrder = {
            column: columnName,
            order: sortOrder.column === columnName && sortOrder.order === 'asc' ? 'desc' : 'asc',
        };

        setSortOrder(newOrder);

        const sortedTickets = [...tickets].sort((a, b) => {
            const aValue = String(a[columnName]);
            const bValue = String(b[columnName]);

            if (newOrder.order === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
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

    const handleToggleMyTickets = () => {
        setShowMyTickets(!showMyTickets);
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
            <div style={{ textAlign: 'center' }}>
                <h2>{showMyTickets ? 'My Tickets' : 'All Tickets'}</h2>
                <button onClick={handleToggleMyTickets}>{showMyTickets ? 'All Tickets' : 'My Tickets'}</button>
                <table border="1" style={{ margin: '0 auto' }}>
                    <thead style={{ backgroundColor: 'dodgerblue'}}>
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
                    {tickets.map(ticket => (
                        <tr key={ticket.id}>
                            <td>{ticket.id}</td>
                            <td>{ticket.name}</td>
                            <td>{ticket.desiredResolutionDate}</td>
                            <td>{ticket.urgency}</td>
                            <td>{ticket.state}</td>
                            <td>Some Action</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTickets;
