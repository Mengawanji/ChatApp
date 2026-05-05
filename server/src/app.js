import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { testConnection } from './config/database.js';
import path from 'path';
import cors from "cors";

dotenv.config();

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await testConnection();
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization failed:', err.message);
  }
})();
 
// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

//test route
app.get("/api/hello", (req, res) =>{
  res.json({message: "Hello from server"})
})

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);


// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


//Make ready for deployment
if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")))

  app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"))
  })
}

app.use(notFound);
app.use(errorHandler);

export default app;