import express from 'express';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/message.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { createTablesAndIndexes } from './config/init-db.js';
import { testConnection } from './config/database.js';

const app = express();


(async () => {
  try {
    await testConnection();
    await createTablesAndIndexes();
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization failed:', err.message);
  }
})();

// Middleware
app.use(express.json());



// Routes
app.use('/auth', authRoutes);
app.use('/message', messageRoutes);


// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

export default app;