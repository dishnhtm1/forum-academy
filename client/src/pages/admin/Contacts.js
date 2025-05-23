import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import AdminSidebar from "../../components/admin/AdminSidebar";
import ContactsTable from "../../components/admin/ContactsTable";
import { fetchContacts, updateContactStatus } from "../../utils/api";
import { formatDateTime } from "../../utils/helpers";

const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadContacts = async () => {
        try {
            setIsLoading(true);
            const result = await fetchContacts();
            setContacts(result.data || []);
        } catch (err) {
            console.error("Error loading contacts:", err);
            setError("Failed to load contacts. Please try again.");
        } finally {
            setIsLoading(false);
        }
        };

        loadContacts();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
        await updateContactStatus(id, status);
        // Update local state to reflect the change
        setContacts(
            contacts.map((contact) =>
            contact._id === id ? { ...contact, status } : contact
            )
        );
        } catch (err) {
        console.error("Error updating contact status:", err);
        alert("Failed to update status. Please try again.");
        }
    };

    const handleViewDetails = (contact) => {
        setSelectedContact(contact);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <DashboardLayout sidebarContent={<AdminSidebar />} title="Contact Messages">
        <div className="page-header">
            <h2>Contact Messages</h2>
            <p>View and manage messages received through the contact form.</p>
        </div>

        {error ? (
            <div className="error-message">
            <span className="material-icons">error</span>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        ) : (
            <div className="data-container">
            <ContactsTable
                contacts={contacts}
                isLoading={isLoading}
                onUpdateStatus={handleStatusUpdate}
                onViewDetails={handleViewDetails}
            />
            </div>
        )}

        {/* Contact Details Modal */}
        {isModalOpen && selectedContact && (
            <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                <h3>Contact Details</h3>
                <button className="close-modal" onClick={closeModal}>
                    <span className="material-icons">close</span>
                </button>
                </div>
                <div className="modal-body">
                <div className="details-group">
                    <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedContact.name}</span>
                    </div>
                    <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedContact.email}</span>
                    </div>
                    <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">
                        {selectedContact.phone || "Not provided"}
                    </span>
                    </div>
                    <div className="detail-item">
                    <span className="detail-label">Subject:</span>
                    <span className="detail-value">
                        {selectedContact.subject || "No subject"}
                    </span>
                    </div>
                    <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                        {formatDateTime(selectedContact.createdAt)}
                    </span>
                    </div>
                    <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <select
                        className={`status-select ${
                        selectedContact.status || "new"
                        }`}
                        value={selectedContact.status || "new"}
                        onChange={(e) =>
                        handleStatusUpdate(selectedContact._id, e.target.value)
                        }
                    >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                    </select>
                    </div>
                </div>

                <div className="message-content">
                    <h4>Message:</h4>
                    <div className="message-box">{selectedContact.message}</div>
                </div>
                </div>
                <div className="modal-footer">
                <button className="reply-button">
                    <span className="material-icons">reply</span> Reply
                </button>
                <button className="close-button" onClick={closeModal}>
                    Close
                </button>
                </div>
            </div>
            </div>
        )}
        </DashboardLayout>
    );
};

export default AdminContacts;
