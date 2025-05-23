import React, { useState } from "react";
import { formatDate, getStatusColor, truncateText } from "../../utils/helpers";

const ContactsTable = ({
    contacts,
    isLoading,
    onUpdateStatus,
    onViewDetails,
    }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("newest");

    if (isLoading) {
        return (
        <div className="loading">
            <div className="spinner"></div>
            <p>Loading contacts...</p>
        </div>
        );
    }

    if (!contacts || contacts.length === 0) {
        return (
        <div className="empty-state">
            <span className="material-icons">email</span>
            <p>No contacts found</p>
        </div>
        );
    }

    // Filter contacts
    const filteredContacts = contacts.filter((contact) => {
        const searchMatch =
        (contact.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (contact.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (contact.subject?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
        ) ||
        (contact.message?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        const statusMatch =
        statusFilter === "all" || contact.status === statusFilter;

        return searchMatch && statusMatch;
    });

    // Sort contacts
    const sortedContacts = [...filteredContacts].sort((a, b) => {
        if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
        }
    });

    // Handle status change
    const handleStatusChange = (id, newStatus) => {
        if (onUpdateStatus) {
        onUpdateStatus(id, newStatus);
        }
    };

    return (
        <div>
        <div className="table-controls">
            <div className="search-box">
            <span className="material-icons">search</span>
            <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>

            <div className="filters">
            <div className="filter">
                <label>Status:</label>
                <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                >
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                </select>
            </div>

            <div className="filter">
                <label>Sort:</label>
                <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                </select>
            </div>
            </div>
        </div>

        <div className="table-responsive">
            <table className="data-table">
            <thead>
                <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {sortedContacts.map((contact) => (
                <tr key={contact._id}>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.subject || "No subject"}</td>
                    <td className="message-cell">
                    {truncateText(contact.message, 50)}
                    </td>
                    <td>{formatDate(contact.createdAt)}</td>
                    <td>
                    <select
                        className={`status-select ${getStatusColor(
                        contact.status
                        )}`}
                        value={contact.status || "new"}
                        onChange={(e) =>
                        handleStatusChange(contact._id, e.target.value)
                        }
                    >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                    </select>
                    </td>
                    <td>
                    <div className="action-buttons">
                        <button
                        className="action-button view"
                        onClick={() => onViewDetails(contact)}
                        >
                        <span className="material-icons">visibility</span>
                        </button>
                        <button className="action-button reply">
                        <span className="material-icons">reply</span>
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
};

export default ContactsTable;
