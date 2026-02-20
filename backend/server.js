const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true
}));
app.use(cookieParser());

// Test Route
const authRoutes = require('./src/routes/authRoutes');

// Routes
app.use('/api', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'KodBank Backend is running!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
