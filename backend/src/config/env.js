require('dotenv').config();

module.exports = {
    port: process.env.PORT || 8080,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'default_secret_please_change',
    db: {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'bienestar',
        password: process.env.DB_PASSWORD || 'CAMILO129',
        port: process.env.DB_PORT || 5432,
    },
};
