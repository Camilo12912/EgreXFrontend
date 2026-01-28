const app = require('./app');
const { config } = require('dotenv');
const initializeDatabase = require('./config/init_db');

// Load environment variables
config();

const PORT = process.env.PORT || 8080;

// Initialize Database and then start server
async function startServer() {
    try {
        console.log('Iniciando sistema...');
        await initializeDatabase();

        const server = app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            console.log('UNHANDLED REJECTION! 💥 Shutting down...');
            console.log(err.name, err.message);
            server.close(() => {
                process.exit(1);
            });
        });
    } catch (error) {
        console.error('Fallo al iniciar el servidor debido a la base de datos:', error);
        process.exit(1);
    }
}

startServer();

module.exports = server;
