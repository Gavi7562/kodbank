const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        // Verify JWT signature
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Verify token exists in DB (Extra security as per plan)
        const query = 'SELECT * FROM token_data WHERE jwt_token = $1';
        const result = await pool.query(query, [token]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};

module.exports = verifyToken;
