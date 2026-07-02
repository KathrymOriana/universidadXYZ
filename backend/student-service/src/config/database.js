const { Pool } = require('pg');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';

const pool = new Pool({
    host:     process.env.DB_HOST || 'localhost',
    port:     parseInt(process.env.DB_PORT) || 5432,
    database: isTest
        ? (process.env.DB_TEST_NAME || 'universidad_test_db')
        : (process.env.DB_NAME      || 'universidad_db'),
    user:     process.env.DB_USER     || 'postgres',
    password: process.env.DB_PASSWORD,
    max:                    isTest ? 5 : 10,
    idleTimeoutMillis:      30000,
    connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
    if (!isTest) console.log(`✓ [${process.env.SERVICE_NAME}] PostgreSQL conectado`);
});

pool.on('error', (err) => {
    console.error('✖ Error en pool PostgreSQL:', err.message);
    process.exit(-1);
});

module.exports = pool;