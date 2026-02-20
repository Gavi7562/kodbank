const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    const { uname, password, email, phone } = req.body;

    if (!uname || !password || !email || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const query = 'INSERT INTO userData (uname, password, email, phone) VALUES ($1, $2, $3, $4) RETURNING uid';
        const values = [uname, hashedPassword, email, phone];
        const result = await pool.query(query, values);

        res.status(201).json({ message: 'User registered successfully', uid: result.rows[0].uid });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === '23505') { // PostgreSQL duplicate key error code
            return res.status(409).json({ message: 'Username already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Check user
        const query = 'SELECT * FROM userData WHERE uname = $1';
        const result = await pool.query(query, [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate Token
        // Using username as subject and role as claim
        const token = jwt.sign(
            { sub: user.uname, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Store token in DB
        await pool.query(
            'INSERT INTO token_data (username, jwt_token) VALUES ($1, $2)',
            [user.uname, token]
        );

        // Set Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // MUST be true for cross-origin cookies
            sameSite: 'none', // MUST be 'none' for cross-origin cookies
            maxAge: 3600000 // 1 hour
        });

        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getBalance = async (req, res) => {
    // Middleware should have already verified token and attached user to req
    const username = req.user.sub; // From JWT payload

    try {
        const query = 'SELECT balance FROM userData WHERE uname = $1';
        const result = await pool.query(query, [username]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ balance: result.rows[0].balance });
    } catch (error) {
        console.error('Get Balance error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { register, login, getBalance };
