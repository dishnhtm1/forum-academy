import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({
        component: Component,
        allowedRoles = [],
        ...rest
    }) => {
    const { currentUser, isLoading } = useAuth();

    // Show loading while checking authentication
    if (isLoading) {
        return (
        <div className="auth-loading">
            <div className="spinner"></div>
            <p>Loading authentication...</p>
        </div>
        );
    }

    // Render the protected component if user is logged in and has the right role
    return (
        <Route
        {...rest}
        element={
            currentUser ? (
            allowedRoles.length === 0 ||
            allowedRoles.includes(currentUser.role) ? (
                <Component />
            ) : (
                // Redirect to unauthorized page if wrong role
                <Navigate to="/unauthorized" replace />
            )
            ) : (
            // Redirect to login if not authenticated
            <Navigate to="/login" replace state={{ from: rest.path }} />
            )
        }
        />
    );
};

export default ProtectedRoute;
