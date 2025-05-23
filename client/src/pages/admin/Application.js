import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import AdminSidebar from "../../components/admin/AdminSidebar";
import ApplicationsTable from "../../components/admin/ApplicationsTable";
import { fetchApplications, updateApplication } from "../../utils/api";

const AdminApplications = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadApplications = async () => {
        try {
            setIsLoading(true);
            const result = await fetchApplications();
            setApplications(result.data || []);
        } catch (err) {
            console.error("Error loading applications:", err);
            setError("Failed to load applications. Please try again.");
        } finally {
            setIsLoading(false);
        }
        };

        loadApplications();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
        await updateApplication(id, { status });
        // Update local state to reflect the change
        setApplications(
            applications.map((app) => (app._id === id ? { ...app, status } : app))
        );
        } catch (err) {
        console.error("Error updating application status:", err);
        alert("Failed to update status. Please try again.");
        }
    };

    return (
        <DashboardLayout sidebarContent={<AdminSidebar />} title="Applications">
        <div className="page-header">
            <h2>Student Applications</h2>
            <p>View and manage applications submitted by prospective students.</p>
        </div>

        {error ? (
            <div className="error-message">
            <span className="material-icons">error</span>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        ) : (
            <div className="data-container">
            <ApplicationsTable
                applications={applications}
                isLoading={isLoading}
                onUpdateStatus={handleStatusUpdate}
            />
            </div>
        )}
        </DashboardLayout>
    );
};

export default AdminApplications;
