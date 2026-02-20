const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://gavi7562.github.io'], // Allow local dev and production frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(cookieParser());

// Test Route
const authRoutes = require('./src/routes/authRoutes');

// Routes
app.use('/api', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'KodBank Backend is running!' });
});

// Start Server (local development)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;
