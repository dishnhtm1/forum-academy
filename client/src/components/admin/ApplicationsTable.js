import React, { useState } from "react";
import { formatDateTime } from "../../utils/helpers";

const ApplicationsTable = ({
        applications = [],
        isLoading,
        onUpdateStatus,
    }) => {
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [currentApplication, setCurrentApplication] = useState(null);

    // Filter applications based on search and status
    const filteredApplications = applications.filter((app) => {
        const matchesSearch =
        searchTerm === "" ||
        `${app.firstName} ${app.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.program?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
        selectedStatus === "all" || app.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const handleViewDetails = (application) => {
        setCurrentApplication(application);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setCurrentApplication(null);
    };

    const handleStatusChange = (id, newStatus) => {
        onUpdateStatus(id, newStatus);
        if (currentApplication && currentApplication._id === id) {
        setCurrentApplication({ ...currentApplication, status: newStatus });
        }
    };

    if (isLoading) {
        return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading applications...</p>
        </div>
        );
    }

    return (
        <div className="applications-table-container">
        <div className="filter-container">
            <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select
                id="status-filter"
                className="filter-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
            >
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
            </select>
            </div>

            <div className="filter-group">
            <input
                type="text"
                className="search-input"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
        </div>

        {filteredApplications.length === 0 ? (
            <div className="empty-list">
            <p>No applications found.</p>
            </div>
        ) : (
            <table className="data-table">
            <thead>
                <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Program</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredApplications.map((application) => (
                <tr key={application._id}>
                    <td>{`${application.firstName} ${application.lastName}`}</td>
                    <td>{application.email}</td>
                    <td>{application.program || "Not specified"}</td>
                    <td>{formatDateTime(application.createdAt)}</td>
                    <td>
                    <span
                        className={`status-badge ${application.status || "new"}`}
                    >
                        {application.status || "New"}
                    </span>
                    </td>
                    <td>
                    <div className="table-actions">
                        <button
                        className="action-btn view"
                        onClick={() => handleViewDetails(application)}
                        >
                        <span className="material-icons">visibility</span>
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}

        {/* Application Details Modal */}
        {modalOpen && currentApplication && (
            <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                <h2>Application Details</h2>
                <button className="close-btn" onClick={closeModal}>
                    <span className="material-icons">close</span>
                </button>
                </div>
                <div className="modal-body">
                <div className="applicant-header">
                    <h3>{`${currentApplication.firstName} ${currentApplication.lastName}`}</h3>
                    <div className="status-selector">
                    <select
                        value={currentApplication.status || "new"}
                        onChange={(e) =>
                        handleStatusChange(currentApplication._id, e.target.value)
                        }
                    >
                        <option value="new">New</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    </div>
                </div>

                <div className="detail-section">
                    <h4>Personal Information</h4>
                    <div className="detail-grid">
                    <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span>{currentApplication.email}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Phone:</span>
                        <span>{currentApplication.phone || "Not provided"}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Address:</span>
                        <span>{currentApplication.address || "Not provided"}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Date of Birth:</span>
                        <span>
                        {currentApplication.dateOfBirth
                            ? new Date(
                                currentApplication.dateOfBirth
                            ).toLocaleDateString()
                            : "Not provided"}
                        </span>
                    </div>
                    </div>
                </div>

                <div className="detail-section">
                    <h4>Program Information</h4>
                    <div className="detail-grid">
                    <div className="detail-item">
                        <span className="detail-label">Program:</span>
                        <span>{currentApplication.program || "Not selected"}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Start Date:</span>
                        <span>
                        {currentApplication.startDate || "Not specified"}
                        </span>
                    </div>
                    </div>
                </div>

                <div className="detail-section">
                    <h4>Education and Background</h4>
                    <div className="detail-grid">
                    <div className="detail-item full-width">
                        <span className="detail-label">Education:</span>
                        <span>
                        {currentApplication.education || "Not provided"}
                        </span>
                    </div>
                    <div className="detail-item full-width">
                        <span className="detail-label">Previous Experience:</span>
                        <span>
                        {currentApplication.experience || "Not provided"}
                        </span>
                    </div>
                    </div>
                </div>

                <div className="detail-section">
                    <h4>Additional Information</h4>
                    <div className="detail-item full-width">
                    <span className="detail-label">Why interested:</span>
                    <div className="text-content">
                        {currentApplication.whyInterested || "Not provided"}
                    </div>
                    </div>
                    <div className="detail-item full-width">
                    <span className="detail-label">How heard about us:</span>
                    <span>{currentApplication.howHeard || "Not specified"}</span>
                    </div>
                </div>

                <div className="detail-section">
                    <h4>Application Timeline</h4>
                    <div className="timeline">
                    <div className="timeline-event">
                        <div className="timeline-icon">
                        <span className="material-icons">edit_note</span>
                        </div>
                        <div className="timeline-content">
                        <span className="timeline-title">
                            Application Submitted
                        </span>
                        <span className="timeline-date">
                            {formatDateTime(currentApplication.createdAt)}
                        </span>
                        </div>
                    </div>
                    {currentApplication.updatedAt &&
                        currentApplication.updatedAt !==
                        currentApplication.createdAt && (
                        <div className="timeline-event">
                            <div className="timeline-icon">
                            <span className="material-icons">update</span>
                            </div>
                            <div className="timeline-content">
                            <span className="timeline-title">
                                Application Updated
                            </span>
                            <span className="timeline-date">
                                {formatDateTime(currentApplication.updatedAt)}
                            </span>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
                </div>
                <div className="modal-footer">
                <button className="btn btn-outline" onClick={closeModal}>
                    Close
                </button>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                    // Download application as PDF or print
                    window.print();
                    }}
                >
                    <span className="material-icons">print</span>
                    Print
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default ApplicationsTable;
