import app from './src/app.js';
import dotenv from 'dotenv';
import { testConnection } from './src/config/database.js';
import User from './src/models/User.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // 1. Test DB connection
  await testConnection();

  // 2. Create tables if they don't exist
  await User.createTable();

  // 3. Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API health check: http://localhost:${PORT}/health`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();