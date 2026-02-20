const pool = require('./db');

const createTables = async () => {
    try {
        console.log("Connecting to PostgreSQL database...");
        console.log(`DB_HOST: ${process.env.DB_HOST}`);
        const client = await pool.connect();
        console.log('Database connection successful.');

        // Create userData table
        await client.query(`
            CREATE TABLE IF NOT EXISTS userData (
                uid SERIAL PRIMARY KEY,
                uname VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                role VARCHAR(50) DEFAULT 'customer',
                balance DECIMAL(15,2) DEFAULT 100000.00
            );
        `);
        console.log('userData table created or already exists.');

        // Create token_data table
        await client.query(`
            CREATE TABLE IF NOT EXISTS token_data (
                token_id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                jwt_token TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (username) REFERENCES userData(uname) ON DELETE CASCADE
            );
        `);
        console.log('token_data table created or already exists.');

        client.release();
        process.exit(0);
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
};

createTables();
