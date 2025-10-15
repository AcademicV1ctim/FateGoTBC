const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    try {
        // Retrieve token from cookies
        const token = req.cookies.auth_token; 
        if (!token) {
            return res.status(401).json({ error: 'Authorization token is required' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Attach user data to request
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
}

module.exports = authenticateToken;