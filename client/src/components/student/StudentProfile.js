import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StudentSidebar from "../../components/student/StudentSidebar";
import { useAuth } from "../../context/AuthContext";
import { fetchStudentProfile, updateStudentProfile } from "../../utils/api";
import "../../styles/Dashboard.css";

const StudentProfile = () => {
    const { currentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        bio: "",
        profileImage: "",
        socialLinks: {
        linkedin: "",
        github: "",
        twitter: "",
        },
        education: [],
        skills: [],
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [fileUpload, setFileUpload] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
        try {
            setIsLoading(true);
            const data = await fetchStudentProfile(currentUser.id);
            setProfile(data);
            setEditedProfile(data);
        } catch (err) {
            console.error("Error loading profile:", err);
            setError("Failed to load profile data. Please try again.");
        } finally {
            setIsLoading(false);
        }
        };

        loadProfile();
    }, [currentUser.id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Handle nested objects like socialLinks
        if (name.includes(".")) {
        const [parent, child] = name.split(".");
        setEditedProfile({
            ...editedProfile,
            [parent]: {
            ...editedProfile[parent],
            [child]: value,
            },
        });
        } else {
        setEditedProfile({
            ...editedProfile,
            [name]: value,
        });
        }
    };

    const handleFileChange = (e) => {
        setFileUpload(e.target.files[0]);
    };

    const handleSaveProfile = async () => {
        try {
        setIsSaving(true);

        // Create form data if there's a file upload
        let data;
        if (fileUpload) {
            const formData = new FormData();
            formData.append("profileImage", fileUpload);

            // Add other profile fields to form data
            Object.entries(editedProfile).forEach(([key, value]) => {
            if (key !== "profileImage" && typeof value !== "object") {
                formData.append(key, value);
            } else if (typeof value === "object" && value !== null) {
                formData.append(key, JSON.stringify(value));
            }
            });

            data = formData;
        } else {
            data = editedProfile;
        }

        const updatedProfile = await updateStudentProfile(currentUser.id, data);
        setProfile(updatedProfile);
        setIsEditing(false);
        setFileUpload(null);
        } catch (err) {
        console.error("Error updating profile:", err);
        setError("Failed to update profile. Please try again.");
        } finally {
        setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
        <DashboardLayout sidebarContent={<StudentSidebar />} title="My Profile">
            <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your profile...</p>
            </div>
        </DashboardLayout>
        );
    }

    return (
        <DashboardLayout sidebarContent={<StudentSidebar />} title="My Profile">
        {error && (
            <div className="alert alert-danger">
            <span className="material-icons">error</span>
            <p>{error}</p>
            </div>
        )}

        <div className="profile-container">
            <div className="profile-header">
            <div className="profile-image-container">
                {isEditing ? (
                <div className="edit-profile-image">
                    <div className="current-image">
                    {profile.profileImage ? (
                        <img
                        src={profile.profileImage}
                        alt="Profile"
                        className="profile-image"
                        />
                    ) : (
                        <span className="material-icons profile-placeholder">
                        account_circle
                        </span>
                    )}
                    </div>
                    <div className="upload-controls">
                    <label htmlFor="profile-upload" className="btn btn-outline">
                        <span className="material-icons">photo_camera</span>
                        Change Photo
                    </label>
                    <input
                        type="file"
                        id="profile-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        hidden
                    />
                    {fileUpload && (
                        <div className="file-selected">
                        {fileUpload.name} selected
                        </div>
                    )}
                    </div>
                </div>
                ) : (
                <>
                    {profile.profileImage ? (
                    <img
                        src={profile.profileImage}
                        alt="Profile"
                        className="profile-image"
                    />
                    ) : (
                    <span className="material-icons profile-placeholder">
                        account_circle
                    </span>
                    )}
                </>
                )}
            </div>

            <div className="profile-info">
                <h2>{`${profile.firstName} ${profile.lastName}`}</h2>
                <p className="profile-email">{profile.email}</p>

                <div className="profile-actions">
                {isEditing ? (
                    <>
                    <button
                        className="btn btn-primary"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                        <>
                            <div className="btn-spinner"></div>
                            Saving...
                        </>
                        ) : (
                        <>
                            <span className="material-icons">save</span>
                            Save Changes
                        </>
                        )}
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => {
                        setIsEditing(false);
                        setEditedProfile(profile);
                        setFileUpload(null);
                        }}
                    >
                        Cancel
                    </button>
                    </>
                ) : (
                    <button
                    className="btn btn-outline"
                    onClick={() => setIsEditing(true)}
                    >
                    <span className="material-icons">edit</span>
                    Edit Profile
                    </button>
                )}
                </div>
            </div>
            </div>

            <div className="profile-content">
            <div className="profile-section">
                <h3>Personal Information</h3>

                {isEditing ? (
                <div className="edit-form">
                    <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="form-control"
                        value={editedProfile.firstName || ""}
                        onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="form-control"
                        value={editedProfile.lastName || ""}
                        onChange={handleInputChange}
                        />
                    </div>
                    </div>

                    <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="form-control"
                        value={editedProfile.phone || ""}
                        onChange={handleInputChange}
                    />
                    </div>

                    <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <textarea
                        id="address"
                        name="address"
                        className="form-control"
                        value={editedProfile.address || ""}
                        onChange={handleInputChange}
                        rows="2"
                    />
                    </div>

                    <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        className="form-control"
                        value={
                        editedProfile.dateOfBirth
                            ? editedProfile.dateOfBirth.substr(0, 10)
                            : ""
                        }
                        onChange={handleInputChange}
                    />
                    </div>

                    <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        className="form-control"
                        value={editedProfile.bio || ""}
                        onChange={handleInputChange}
                        rows="4"
                    />
                    </div>
                </div>
                ) : (
                <div className="profile-details">
                    <div className="detail-item">
                    <span className="detail-label">Phone Number:</span>
                    <span>{profile.phone || "Not provided"}</span>
                    </div>

                    <div className="detail-item">
                    <span className="detail-label">Address:</span>
                    <span>{profile.address || "Not provided"}</span>
                    </div>

                    <div className="detail-item">
                    <span className="detail-label">Date of Birth:</span>
                    <span>
                        {profile.dateOfBirth
                        ? new Date(profile.dateOfBirth).toLocaleDateString()
                        : "Not provided"}
                    </span>
                    </div>

                    <div className="detail-item">
                    <span className="detail-label">Bio:</span>
                    <p className="detail-text">
                        {profile.bio || "No bio provided"}
                    </p>
                    </div>
                </div>
                )}
            </div>

            <div className="profile-section">
                <h3>Social Links</h3>

                {isEditing ? (
                <div className="edit-form">
                    <div className="form-group">
                    <label htmlFor="linkedin">
                        <span className="material-icons">link</span>
                        LinkedIn
                    </label>
                    <input
                        type="url"
                        id="linkedin"
                        name="socialLinks.linkedin"
                        className="form-control"
                        value={editedProfile.socialLinks?.linkedin || ""}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/your-profile"
                    />
                    </div>

                    <div className="form-group">
                    <label htmlFor="github">
                        <span className="material-icons">code</span>
                        GitHub
                    </label>
                    <input
                        type="url"
                        id="github"
                        name="socialLinks.github"
                        className="form-control"
                        value={editedProfile.socialLinks?.github || ""}
                        onChange={handleInputChange}
                        placeholder="https://github.com/your-username"
                    />
                    </div>

                    <div className="form-group">
                    <label htmlFor="twitter">
                        <span className="material-icons">chat</span>
                        Twitter
                    </label>
                    <input
                        type="url"
                        id="twitter"
                        name="socialLinks.twitter"
                        className="form-control"
                        value={editedProfile.socialLinks?.twitter || ""}
                        onChange={handleInputChange}
                        placeholder="https://twitter.com/your-handle"
                    />
                    </div>
                </div>
                ) : (
                <div className="social-links">
                    {profile.socialLinks?.linkedin ? (
                    <a
                        href={profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        <span className="material-icons">link</span>
                        LinkedIn Profile
                    </a>
                    ) : null}

                    {profile.socialLinks?.github ? (
                    <a
                        href={profile.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        <span className="material-icons">code</span>
                        GitHub Profile
                    </a>
                    ) : null}

                    {profile.socialLinks?.twitter ? (
                    <a
                        href={profile.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                    >
                        <span className="material-icons">chat</span>
                        Twitter Profile
                    </a>
                    ) : null}

                    {!profile.socialLinks?.linkedin &&
                    !profile.socialLinks?.github &&
                    !profile.socialLinks?.twitter && (
                        <p>No social links provided</p>
                    )}
                </div>
                )}
            </div>
            </div>
        </div>
        </DashboardLayout>
    );
};

export default StudentProfile;
