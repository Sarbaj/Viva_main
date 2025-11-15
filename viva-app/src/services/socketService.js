import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5050') {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to server:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Join user-specific rooms
  joinRoom(userId, role, classCode = null) {
    if (this.socket) {
      this.socket.emit('join-room', { userId, role, classCode });
    }
  }

  // Viva-related events
  joinVivaMonitor(vivaId) {
    if (this.socket) {
      this.socket.emit('join-viva-monitor', vivaId);
    }
  }

  updateVivaStatus(data) {
    if (this.socket) {
      this.socket.emit('viva-status-update', data);
    }
  }

  updateStudentProgress(data) {
    if (this.socket) {
      this.socket.emit('student-viva-progress', data);
    }
  }

  // Notification events
  sendNotification(data) {
    if (this.socket) {
      this.socket.emit('send-notification', data);
    }
  }

  // Event listeners
  onVivaStatusChanged(callback) {
    if (this.socket) {
      this.socket.on('viva-status-changed', callback);
    }
  }

  onStudentProgressUpdate(callback) {
    if (this.socket) {
      this.socket.on('student-progress-update', callback);
    }
  }

  onNewNotification(callback) {
    if (this.socket) {
      this.socket.on('new-notification', callback);
    }
  }

  // Remove event listeners
  offVivaStatusChanged() {
    if (this.socket) {
      this.socket.off('viva-status-changed');
    }
  }

  offStudentProgressUpdate() {
    if (this.socket) {
      this.socket.off('student-progress-update');
    }
  }

  offNewNotification() {
    if (this.socket) {
      this.socket.off('new-notification');
    }
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }

  // Check connection status
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }
}

// Create singleton instance
const socketService = new SocketService();
export default socketService;