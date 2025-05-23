const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "No token, authorization denied" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by id
        const user = await User.findById(decoded.id);

        if (!user) {
        return res
            .status(401)
            .json({ success: false, message: "User not found" });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res
        .status(401)
        .json({ success: false, message: "Token is not valid" });
    }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res
        .status(403)
        .json({
            success: false,
            message: "Access denied. Admin privileges required",
        });
    }
};

module.exports = {
    authMiddleware,
    isAdmin,
};
