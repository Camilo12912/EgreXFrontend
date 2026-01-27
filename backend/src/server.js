const app = require('./app');
const { config } = require('dotenv');

// Load environment variables
// We will create config/env.js later which might handle this, but for now standard dotenv usage
config();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

module.exports = server;
