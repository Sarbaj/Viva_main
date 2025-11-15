import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import DbConnection from "./db/Db.js";
import router from "./routes/Router.js";

dotenv.config();
const app = express();
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: ["https://vivaportal.vercel.app", "http://localhost:5173"],
    credentials: true,
  }
});

app.use(
  cors({
    origin: ["https://vivaportal.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

// Make io available to routes
app.set('io', io);

DbConnection(); // MongoDB connect

app.get("/", (req, res) => res.send("Server running"));

app.use("/bin", router);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room based on user role and ID
  socket.on('join-room', (data) => {
    const { userId, role, classCode } = data;
    
    // Join user-specific room
    socket.join(`user-${userId}`);
    
    // Join role-specific rooms
    if (role === '1') { // Teacher
      socket.join(`teacher-${userId}`);
      if (classCode) {
        socket.join(`class-${classCode}`);
      }
    } else if (role === '0') { // Student
      socket.join(`student-${userId}`);
      if (classCode) {
        socket.join(`class-${classCode}`);
      }
    } else if (role === '2') { // Admin
      socket.join('admin');
    }
    
    console.log(`User ${userId} joined rooms for role ${role}`);
  });

  // Handle viva status updates
  socket.on('viva-status-update', (data) => {
    socket.to(`class-${data.classCode}`).emit('viva-status-changed', data);
  });

  // Handle real-time viva monitoring
  socket.on('join-viva-monitor', (vivaId) => {
    socket.join(`viva-${vivaId}`);
  });

  // Handle student viva progress
  socket.on('student-viva-progress', (data) => {
    socket.to(`viva-${data.vivaId}`).emit('student-progress-update', data);
  });

  // Handle notifications
  socket.on('send-notification', (data) => {
    if (data.targetRole === 'teacher') {
      socket.to(`teacher-${data.targetId}`).emit('new-notification', data);
    } else if (data.targetRole === 'student') {
      socket.to(`student-${data.targetId}`).emit('new-notification', data);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      message: "Invalid token", 
      expired: true 
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      message: "Token expired", 
      expired: true 
    });
  }
  
  // Handle MongoDB errors
  if (err.name === 'MongooseError' || err.name === 'MongoError') {
    return res.status(500).json({ 
      message: "Database connection error", 
      error: "Please try again later" 
    });
  }
  
  // Default error
  res.status(500).json({ 
    message: "Internal server error", 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong' 
  });
});

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => console.log(`Server running on port ${PORT} with Socket.IO`));
