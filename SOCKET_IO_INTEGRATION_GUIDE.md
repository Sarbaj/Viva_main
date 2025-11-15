# 🔄 Socket.IO Real-time Integration Guide

## Overview
This guide explains how Socket.IO has been integrated into the Viva Portal platform to provide real-time functionality for enhanced user experience.

## 🚀 Implementation Summary

### Backend Changes
1. **Added Socket.IO Server** to `app.js`
2. **Updated API Routes** to emit real-time events
3. **Added Room Management** for targeted messaging
4. **Implemented Event Handlers** for various user actions

### Frontend Changes
1. **Created Socket Service** for centralized Socket.IO management
2. **Added Real-time Event Listeners** in components
3. **Implemented Connection Management** with auto-reconnection

## 📦 Dependencies Added

### Backend
```json
{
  "socket.io": "^4.7.5"
}
```

### Frontend
```json
{
  "socket.io-client": "^4.7.5"
}
```

## 🔧 Backend Implementation

### 1. Server Setup (app.js)
```javascript
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://vivaportal.vercel.app", "http://localhost:5173"],
    credentials: true,
  }
});

// Make io available to routes
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Room management
  socket.on('join-room', (data) => {
    const { userId, role, classCode } = data;
    socket.join(`user-${userId}`);
    socket.join(`${role}-${userId}`);
    if (classCode) socket.join(`class-${classCode}`);
  });

  // Event handlers
  socket.on('viva-status-update', (data) => {
    socket.to(`class-${data.classCode}`).emit('viva-status-changed', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT} with Socket.IO`));
```

### 2. Route Integration
```javascript
// Helper function to get Socket.IO instance
const getIO = (req) => {
  return req.app.get('io');
};

// Example: Viva creation with real-time notification
router.post("/create/viva", async (req, res) => {
  // ... viva creation logic ...
  
  // Emit real-time notification
  const io = getIO(req);
  if (io) {
    io.to(`class-${classCode}`).emit('new-viva-created', {
      vivaId: newViva._id,
      title: title,
      classCode: classCode,
      message: `New viva "${title}" has been created`
    });
  }
  
  res.status(201).json({ message: "Successfully Viva Created" });
});
```

## 🎨 Frontend Implementation

### 1. Socket Service (services/socketService.js)
```javascript
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(serverUrl = 'http://localhost:5050') {
    if (this.socket) return this.socket;

    this.socket = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to server:', this.socket.id);
      this.isConnected = true;
    });

    return this.socket;
  }

  joinRoom(userId, role, classCode = null) {
    if (this.socket) {
      this.socket.emit('join-room', { userId, role, classCode });
    }
  }

  // Event emitters
  updateVivaStatus(data) {
    if (this.socket) {
      this.socket.emit('viva-status-update', data);
    }
  }

  // Event listeners
  onVivaStatusChanged(callback) {
    if (this.socket) {
      this.socket.on('viva-status-changed', callback);
    }
  }
}

const socketService = new SocketService();
export default socketService;
```

### 2. Component Integration Example
```javascript
import { useEffect } from 'react';
import socketService from '../services/socketService';

const StudentDashboard = () => {
  useEffect(() => {
    // Connect to Socket.IO
    socketService.connect();
    socketService.joinRoom(userId, '0', classCode);

    // Listen for real-time updates
    socketService.onVivaStatusChanged((data) => {
      console.log('Viva status changed:', data);
      // Update UI accordingly
      setVivaStatus(data.status);
      showNotification(data.message);
    });

    // Cleanup on unmount
    return () => {
      socketService.offVivaStatusChanged();
    };
  }, []);

  return (
    // Component JSX
  );
};
```

## 🏠 Room Management System

### Room Structure
```javascript
// User-specific rooms
`user-${userId}` - Individual user room

// Role-specific rooms
`student-${userId}` - Student-specific room
`teacher-${userId}` - Teacher-specific room
`admin` - Admin room

// Class-specific rooms
`class-${classCode}` - All users in a class

// Viva-specific rooms
`viva-${vivaId}` - Viva monitoring room
```

### Room Usage Examples
```javascript
// Notify all students in a class
io.to(`class-${classCode}`).emit('new-viva-created', data);

// Notify specific teacher
io.to(`teacher-${teacherId}`).emit('new-notification', data);

// Update viva monitor
io.to(`viva-${vivaId}`).emit('student-progress-update', data);
```

## 📡 Real-time Events

### 1. Viva Management Events
```javascript
// Server emits
'new-viva-created' - When teacher creates a viva
'viva-status-changed' - When viva starts/stops/ends
'viva-status-update' - For monitoring dashboard

// Client emits
'viva-status-update' - Teacher updates viva status
'join-viva-monitor' - Teacher joins monitoring room
```

### 2. Student Progress Events
```javascript
// Server emits
'student-progress-update' - Student submission updates

// Client emits
'student-viva-progress' - Student progress during viva
```

### 3. Notification Events
```javascript
// Server emits
'new-notification' - New notification for user

// Client emits
'send-notification' - Send notification to target user
```

## 🔄 Event Flow Examples

### 1. Viva Creation Flow
```
1. Teacher creates viva → POST /create/viva
2. Server saves viva to database
3. Server emits 'new-viva-created' to class room
4. All students in class receive real-time notification
5. Student UI updates with new viva available
```

### 2. Viva Status Change Flow
```
1. Teacher clicks start/stop viva → POST /viva/toggle-status
2. Server updates viva status in database
3. Server emits 'viva-status-changed' to class room
4. Server emits 'viva-status-update' to monitor room
5. Students see real-time status update
6. Teacher monitor updates in real-time
```

### 3. Student Submission Flow
```
1. Student submits viva → POST /update/status
2. Server processes submission and saves result
3. Server emits 'student-progress-update' to viva monitor
4. Teacher sees real-time submission update
5. Student receives confirmation
```

## 🛠️ Usage Instructions

### For Developers

#### 1. Starting the Application
```bash
# Backend (with Socket.IO)
cd BACKEND
npm install socket.io
npm run dev

# Frontend (with Socket.IO client)
cd viva-app
npm install socket.io-client
npm run dev
```

#### 2. Testing Real-time Features
1. Open multiple browser tabs/windows
2. Login as different users (student/teacher)
3. Create a viva as teacher
4. Observe real-time notifications on student dashboard
5. Start viva and monitor real-time status updates

#### 3. Debugging Socket.IO
```javascript
// Enable debug mode
localStorage.debug = 'socket.io-client:socket';

// Check connection status
console.log('Socket connected:', socketService.isSocketConnected());

// Monitor events
socketService.getSocket().onAny((event, ...args) => {
  console.log('Socket event:', event, args);
});
```

## 🔧 Configuration Options

### Server Configuration
```javascript
const io = new Server(server, {
  cors: {
    origin: ["https://vivaportal.vercel.app", "http://localhost:5173"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling']
});
```

### Client Configuration
```javascript
const socket = io(serverUrl, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  timeout: 20000,
  forceNew: true
});
```

## 🚀 Performance Considerations

### 1. Connection Management
- Automatic reconnection on disconnect
- Connection pooling for multiple tabs
- Graceful degradation when Socket.IO unavailable

### 2. Event Optimization
- Room-based broadcasting to reduce unnecessary traffic
- Event throttling to prevent spam
- Proper cleanup of event listeners

### 3. Memory Management
- Remove event listeners on component unmount
- Clear intervals and timeouts
- Proper socket disconnection

## 🔍 Troubleshooting

### Common Issues

#### 1. Connection Failed
```javascript
// Check server URL and CORS configuration
// Verify firewall settings
// Test with polling transport only
```

#### 2. Events Not Received
```javascript
// Verify room joining
// Check event names (case-sensitive)
// Ensure proper authentication
```

#### 3. Multiple Connections
```javascript
// Use singleton pattern for socket service
// Prevent multiple socket instances
// Proper cleanup on route changes
```

### Debug Commands
```javascript
// Check active rooms
socket.rooms

// Monitor all events
socket.onAny((event, ...args) => console.log(event, args));

// Connection status
socket.connected
```

## 📈 Benefits Achieved

### 1. Enhanced User Experience
- ✅ Instant notifications without page refresh
- ✅ Real-time viva status updates
- ✅ Live monitoring of student progress
- ✅ Immediate feedback on actions

### 2. Improved Efficiency
- ✅ Reduced server polling
- ✅ Lower bandwidth usage
- ✅ Better resource utilization
- ✅ Faster response times

### 3. Better Engagement
- ✅ Interactive user interface
- ✅ Real-time collaboration features
- ✅ Immediate system feedback
- ✅ Enhanced monitoring capabilities

## 🔮 Future Enhancements

### Planned Features
- **Typing Indicators** - Show when users are active
- **Presence System** - Online/offline status
- **Chat System** - Real-time messaging
- **Screen Sharing** - For remote assistance
- **Voice/Video** - WebRTC integration

### Technical Improvements
- **Redis Adapter** - For horizontal scaling
- **Message Queuing** - Reliable message delivery
- **Event Persistence** - Store events for offline users
- **Advanced Analytics** - Real-time usage metrics

---

This Socket.IO integration provides a solid foundation for real-time features in the Viva Portal platform, enhancing user experience and enabling advanced monitoring capabilities.