const jwt = require('jsonwebtoken');

function authorizeUser(req, res, next) {
    try {
        // Retrieve token from cookies
        const token = req.cookies.auth_token; 

        if (!token) {
            return res.status(401).json({ error: 'Authorization token is required' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Check if the user is an admin
        if (decoded.role !== "admin") {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }
        // Attach user data to request
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Authorization error:', error);
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
}

module.exports = authorizeUser;
