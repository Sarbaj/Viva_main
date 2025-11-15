# 🎓 Viva Portal - AI-Powered Education Platform

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Real-time Features](#real-time-features)
- [User Roles & Permissions](#user-roles--permissions)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Installation & Setup](#installation--setup)
- [Deployment](#deployment)
- [Security Features](#security-features)
- [Performance Optimizations](#performance-optimizations)

## 🚀 Project Overview

**Viva Portal** is a comprehensive AI-powered education platform designed to revolutionize online viva examinations and educational management. The platform provides a seamless experience for students, teachers, and administrators with real-time monitoring, AI-generated questions, and advanced analytics.

### 🎯 Mission
To transform traditional viva examinations into an intelligent, efficient, and secure digital experience that enhances learning outcomes and provides valuable insights for educators.

### 🌟 Key Highlights
- **AI-Powered Question Generation** using Google Gemini API
- **Real-time Monitoring** with Socket.IO
- **Multi-role Authentication** (Students, Teachers, Admins)
- **Comprehensive Analytics** and Reporting
- **Email Notifications** for results and updates
- **Light/Dark Theme** support
- **Mobile-Responsive** design
- **Secure Token-based** authentication

## 🏗️ Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • React Router  │    │ • Express.js    │    │ • User Data     │
│ • Redux Toolkit │    │ • Socket.IO     │    │ • Classes       │
│ • Socket.IO     │    │ • JWT Auth      │    │ • Vivas         │
│ • Recharts      │    │ • Nodemailer    │    │ • Results       │
│ • React Icons   │    │ • Mongoose      │    │ • Notifications │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  External APIs  │
                    │                 │
                    │ • Google Gemini │
                    │ • Email Service │
                    └─────────────────┘
```

### Folder Structure
```
Viva_main/
├── BACKEND/
│   ├── db/                 # Database connection
│   ├── middleware/         # Authentication middleware
│   ├── model/             # MongoDB schemas
│   ├── routes/            # API routes
│   ├── services/          # Email service
│   └── app.js            # Main server file
├── viva-app/
│   ├── src/
│   │   ├── PAGE/         # React components/pages
│   │   ├── CSS/          # Stylesheets
│   │   ├── services/     # Socket.IO service
│   │   └── App.jsx       # Main React app
│   └── public/           # Static assets
└── Documentation/        # Project documentation
```

## ✨ Features

### 🎓 For Students
- **Secure Registration** with email OTP verification
- **Class Management** - Join classes with unique codes
- **Viva Participation** - Take AI-generated viva examinations
- **Real-time Updates** - Get instant notifications about viva status
- **Result Tracking** - View detailed performance analytics
- **Profile Management** - Update personal information securely
- **Theme Customization** - Switch between light and dark themes
- **Mobile Responsive** - Optimized for all device sizes

### 👨‍🏫 For Teachers
- **Class Creation** - Generate unique class codes
- **Student Management** - Monitor enrolled students
- **Viva Creation** - Create custom viva examinations
- **AI Question Generation** - Generate questions using AI based on syllabus
- **Real-time Monitoring** - Monitor student progress during vivas
- **Result Management** - Evaluate and grade student submissions
- **Analytics Dashboard** - Comprehensive performance insights
- **Notification System** - Get alerts for student activities
- **Email Integration** - Send results and updates via email

### 👨‍💼 For Administrators
- **User Management** - Manage students and teachers
- **System Analytics** - Platform-wide statistics and insights
- **Teacher Registration** - Add new teachers to the system
- **Data Management** - Comprehensive data oversight
- **System Monitoring** - Monitor platform performance

### 🤖 AI-Powered Features
- **Intelligent Question Generation** - Creates contextual questions based on syllabus
- **Automatic Grading** - AI-powered answer evaluation
- **Performance Analytics** - AI-driven insights and recommendations
- **Adaptive Testing** - Dynamic question difficulty adjustment

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern UI library
- **React Router DOM 7.6.0** - Client-side routing
- **Redux Toolkit 2.8.2** - State management
- **Socket.IO Client 4.7.5** - Real-time communication
- **Recharts 3.1.2** - Data visualization
- **React Toastify 11.0.5** - Notifications
- **Lucide React 0.511.0** - Icon library
- **Vite 6.3.5** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js 5.1.0** - Web framework
- **Socket.IO 4.7.5** - Real-time communication
- **MongoDB** - NoSQL database
- **Mongoose 8.15.0** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Nodemailer 6.9.8** - Email service
- **Axios 1.9.0** - HTTP client

### External Services
- **Google Gemini API** - AI question generation
- **MongoDB Atlas** - Cloud database
- **Email Service** - SMTP email delivery
- **Vercel** - Deployment platform

## 🔄 Real-time Features

### Socket.IO Implementation
The platform uses Socket.IO for real-time communication between clients and server:

#### Connection Management
```javascript
// Server-side room management
socket.on('join-room', (data) => {
  const { userId, role, classCode } = data;
  socket.join(`user-${userId}`);
  socket.join(`${role}-${userId}`);
  if (classCode) socket.join(`class-${classCode}`);
});
```

#### Real-time Events
- **Viva Status Updates** - Instant notifications when vivas start/end
- **Student Progress Monitoring** - Live tracking of student submissions
- **Notification Delivery** - Real-time alerts and messages
- **Class Updates** - Immediate updates for class-related activities

#### Frontend Integration
```javascript
// Socket service for React components
import socketService from './services/socketService';

// Connect and join rooms
socketService.connect();
socketService.joinRoom(userId, role, classCode);

// Listen for real-time updates
socketService.onVivaStatusChanged((data) => {
  // Handle viva status updates
});
```

## 👥 User Roles & Permissions

### Student (Role: "0")
- ✅ Register with email verification
- ✅ Join classes using class codes
- ✅ Participate in vivas
- ✅ View personal results and analytics
- ✅ Update profile information
- ❌ Create classes or vivas
- ❌ Access other students' data

### Teacher (Role: "1")
- ✅ Create and manage classes
- ✅ Create and monitor vivas
- ✅ Generate AI questions
- ✅ Evaluate student submissions
- ✅ Access class analytics
- ✅ Send notifications to students
- ❌ Access admin functions
- ❌ Manage other teachers

### Administrator (Role: "2")
- ✅ Full system access
- ✅ Manage all users
- ✅ Add/remove teachers
- ✅ System-wide analytics
- ✅ Platform configuration
- ✅ Data management

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String (required, 2-30 chars),
  email: String (required, unique),
  password: String (required, hashed),
  ennumber: String (required, unique),
  role: String ("0"=Student, "1"=Teacher, "2"=Admin),
  isVerified: Boolean (default: false),
  otp: String (for email verification),
  otpExpiry: Date,
  timestamps: true
}
```

### Class Schema
```javascript
{
  code: String (unique, 6-char uppercase),
  teacher: String (teacher ID),
  classname: String,
  timestamps: true
}
```

### Viva Schema
```javascript
{
  title: String,
  classCode: String,
  date: String,
  totalquetions: String,
  time: String,
  syllabus: String,
  status: String ("active", "inactive", "ended"),
  marksPerQuestion: Number (default: 1, min: 1),
  timestamps: true
}
```

### Result Schema
```javascript
{
  classCode: String,
  student: String,
  vivaId: String,
  vivaq: Array (questions),
  answers: Array (student answers),
  active: Boolean (true=in-progress, false=submitted),
  score: Number,
  timestamps: true
}
```

### Notification Schemas
```javascript
// Teacher Notifications
{
  teacherId: String,
  studentId: String,
  studentName: String,
  studentEnrollment: String,
  vivaId: String,
  vivaTitle: String,
  classCode: String,
  className: String,
  reason: String ("tab-switch", "minimize", "time-over"),
  message: String,
  isRead: Boolean (default: false),
  createdAt: Date
}

// Student Notifications (Viva Creation)
{
  vivaId: String,
  vivaTitle: String,
  classCode: String,
  className: String,
  message: String,
  isRead: Boolean (default: false),
  createdAt: Date
}
```

## 📡 API Documentation

### Authentication Endpoints
- `POST /bin/send-otp` - Send OTP for registration
- `POST /bin/verify-otp` - Verify OTP and complete registration
- `POST /bin/login` - User login
- `POST /bin/getUsername` - Get user info from token

### Class Management
- `POST /bin/create/classcode` - Create new class
- `POST /bin/join/class` - Join class with code
- `POST /bin/get/teacher-classes-with-stats` - Get teacher's classes
- `POST /bin/get/student-class-count` - Get student's class count

### Viva Management
- `POST /bin/create/viva` - Create new viva
- `POST /bin/viva/toggle-status` - Start/stop/end viva
- `POST /bin/viva/monitor-data` - Get viva monitoring data
- `POST /bin/get/viva-info` - Get student's available vivas
- `POST /bin/take/vivatest` - Start viva attempt
- `POST /bin/update/status` - Submit viva answers

### AI & Questions
- `POST /bin/api/questions` - Generate AI questions
- `POST /bin/api/questionsresultcalculate` - Calculate results

### Analytics & Reports
- `POST /bin/get/analytics` - Teacher analytics
- `GET /bin/admin/stats` - Admin dashboard stats
- `POST /bin/get/all-vivaresult` - Viva results

### Notifications
- `POST /bin/notification/create` - Create notification
- `POST /bin/notification/get-teacher` - Get teacher notifications
- `POST /bin/notification/get-student` - Get student notifications

## 🎨 Frontend Components

### Core Pages
- **Home.jsx** - Landing page with theme support
- **Login.jsx** - Authentication page
- **Register.jsx** - Registration with OTP verification
- **StudentProfile.jsx** - Student dashboard
- **TeacherDashboard.jsx** - Teacher control panel
- **AdminDashboard.jsx** - Administrator interface

### Specialized Components
- **VivaTest.jsx** - Viva examination interface
- **VivaMonitor.jsx** - Real-time viva monitoring
- **VivaAnalytics.jsx** - Performance analytics
- **ClassOverview.jsx** - Class management
- **Studentresult.jsx** - Result viewing

### UI Features
- **Responsive Design** - Mobile-first approach
- **Theme System** - Light/dark mode toggle
- **Loading States** - Skeleton loaders and spinners
- **Toast Notifications** - User feedback system
- **Modal Dialogs** - Interactive forms and confirmations

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup
```bash
cd Viva_main/BACKEND
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

### Frontend Setup
```bash
cd Viva_main/viva-app
npm install
npm run dev
```

### Environment Variables
```env
# Backend (.env)
PORT=5050
DATABASEURI=mongodb://localhost:27017/viva-portal
JWT_SECRET=your-jwt-secret
AIKEY=your-google-gemini-api-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@vivaportal.com
ADMIN_PASSWORD=admin123
```

### Socket.IO Dependencies
```bash
# Backend
npm install socket.io

# Frontend
npm install socket.io-client
```

## 🌐 Deployment

### Production Build
```bash
# Frontend
npm run build

# Backend
npm start
```

### Vercel Deployment
- Frontend: Automatic deployment from Git
- Backend: Serverless functions with vercel.json

### Environment Configuration
- Database: MongoDB Atlas
- Email: Gmail SMTP
- AI: Google Gemini API
- Real-time: Socket.IO with sticky sessions

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens** with 7-day expiration
- **Password Hashing** using bcrypt
- **Email Verification** with OTP
- **Role-based Access Control**
- **Token Expiration Handling**

### Data Protection
- **Input Validation** on all endpoints
- **SQL Injection Prevention** with Mongoose
- **CORS Configuration** for cross-origin requests
- **Rate Limiting** for API endpoints
- **Secure Headers** implementation

### Viva Security
- **Tab Switch Detection** - Auto-submit on focus loss
- **Screen Minimize Detection** - Prevent cheating
- **Time-based Auto-submission** - Enforce time limits
- **Session Management** - Secure viva sessions

## ⚡ Performance Optimizations

### Backend Optimizations
- **Database Query Timeouts** - Prevent hanging queries
- **Connection Pooling** - Efficient database connections
- **Caching Strategies** - Redis for session management
- **Error Handling** - Graceful error recovery
- **Memory Management** - Optimized for scalability

### Frontend Optimizations
- **Code Splitting** - Lazy loading of components
- **Bundle Optimization** - Vite build optimizations
- **Image Optimization** - Compressed assets
- **State Management** - Efficient Redux patterns
- **Memoization** - React.memo for performance

### Real-time Optimizations
- **Room-based Broadcasting** - Targeted message delivery
- **Connection Management** - Automatic reconnection
- **Event Throttling** - Prevent spam events
- **Memory Cleanup** - Proper event listener removal

## 📊 Analytics & Monitoring

### Student Analytics
- Performance trends over time
- Subject-wise analysis
- Improvement recommendations
- Comparative analysis

### Teacher Analytics
- Class performance overview
- Individual student progress
- Question effectiveness analysis
- Engagement metrics

### System Analytics
- Platform usage statistics
- Performance metrics
- Error tracking and monitoring
- Resource utilization

## 🔮 Future Enhancements

### Planned Features
- **Video Proctoring** - AI-powered exam monitoring
- **Advanced Analytics** - Machine learning insights
- **Mobile App** - Native iOS/Android applications
- **Integration APIs** - Third-party LMS integration
- **Blockchain Certificates** - Secure credential verification

### Technical Improvements
- **Microservices Architecture** - Scalable service separation
- **GraphQL API** - Efficient data fetching
- **Progressive Web App** - Offline functionality
- **Advanced Caching** - Redis implementation
- **Load Balancing** - High availability setup

## 🤝 Contributing

### Development Guidelines
1. Follow ESLint configuration
2. Write comprehensive tests
3. Document new features
4. Follow Git commit conventions
5. Ensure mobile responsiveness

### Code Standards
- **JavaScript ES6+** syntax
- **React Hooks** pattern
- **Async/Await** for promises
- **Error Boundaries** for React components
- **TypeScript** migration (planned)

## 📞 Support & Contact

### Technical Support
- **Documentation**: Comprehensive guides and tutorials
- **Issue Tracking**: GitHub Issues for bug reports
- **Community**: Discord server for discussions
- **Email Support**: technical@vivaportal.com

### Business Inquiries
- **Partnerships**: partnerships@vivaportal.com
- **Enterprise**: enterprise@vivaportal.com
- **General**: info@vivaportal.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini API** for AI-powered question generation
- **Socket.IO** for real-time communication
- **MongoDB** for flexible data storage
- **React Community** for excellent documentation
- **Open Source Contributors** for various libraries used

---

**Viva Portal** - Transforming Education Through Technology 🚀

*Built with ❤️ by the Viva Portal Team*