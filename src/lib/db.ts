import mysql from 'mysql2/promise';

// Uso un "pool" di connessioni invece di una singola per permettere a più utenti 
// di accedere contemporaneamente e per non dover riaprire la connessione ogni volta (più veloce)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'SolarTech',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;
