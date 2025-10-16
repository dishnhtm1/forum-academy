# 🚀 Zoom Production Integration Guide

## 📋 Overview

This guide provides a comprehensive plan for implementing real Zoom integration in your Forum Academy application, replacing the current test implementation with a production-ready solution.

## 🔍 Root Cause Analysis: Live Classes Deletion Issue

### **Problem Identified:**
- **In-Memory Storage**: Live classes were stored in `let testMeetings = []` in server memory
- **Data Loss on Restart**: Server restarts (common in development) clear all in-memory data
- **No Persistence**: Meetings were not saved to any database

### **Solution Implemented:**
✅ **Database Persistence**: Replaced in-memory storage with MongoDB
✅ **Persistent Routes**: Updated all API endpoints to use database
✅ **Data Integrity**: Meetings now survive server restarts

---

## 🏗️ Production Integration Steps

### **Step 1: Zoom API Setup**

#### 1.1 Create Zoom App
1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Sign in with your Zoom account
3. Click "Develop" → "Build App"
4. Choose "JWT" app type
5. Fill in app details:
   - **App Name**: Forum Academy Live Classes
   - **Company Name**: Your Company
   - **Developer Email**: Your email
   - **Description**: Live class integration for Forum Academy

#### 1.2 Get API Credentials
After app creation, you'll get:
- **API Key**: `your_api_key`
- **API Secret**: `your_api_secret`
- **JWT Token**: For authentication

#### 1.3 Configure App Settings
- **Redirect URL**: `https://yourdomain.com/auth/zoom/callback`
- **Whitelist URL**: `https://yourdomain.com`
- **Scopes**: 
  - `meeting:write:admin`
  - `meeting:read:admin`
  - `user:read:admin`

### **Step 2: Environment Configuration**

#### 2.1 Server Environment Variables
Create/update `server/.env`:

```env
# Database
MONGO_URI=mongodb://localhost:27017/forum-academy
JWT_SECRET=your-super-secret-jwt-key-for-forum-academy-2024
PORT=5000
NODE_ENV=production

# Zoom API Configuration
ZOOM_API_KEY=your_zoom_api_key
ZOOM_API_SECRET=your_zoom_api_secret
ZOOM_WEBHOOK_SECRET=your_webhook_secret
ZOOM_ACCOUNT_ID=your_account_id

# Application URLs
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

#### 2.2 Client Environment Variables
Create/update `client/.env`:

```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ZOOM_SDK_KEY=your_zoom_sdk_key
REACT_APP_ZOOM_SDK_SECRET=your_zoom_sdk_secret
```

### **Step 3: Install Dependencies**

#### 3.1 Server Dependencies
```bash
cd server
npm install @zoomus/websdk jsonwebtoken axios
```

#### 3.2 Client Dependencies
```bash
cd client
npm install @zoomus/websdk
```

### **Step 4: Update Zoom Service**

#### 4.1 Real Zoom API Integration
Update `server/services/zoomService.js`:

```javascript
const axios = require('axios');
const jwt = require('jsonwebtoken');

class ZoomService {
  constructor() {
    this.apiKey = process.env.ZOOM_API_KEY;
    this.apiSecret = process.env.ZOOM_API_SECRET;
    this.baseURL = 'https://api.zoom.us/v2';
  }

  // Generate JWT token for Zoom API
  generateJWT() {
    const payload = {
      iss: this.apiKey,
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
    };
    
    return jwt.sign(payload, this.apiSecret);
  }

  // Create a real Zoom meeting
  async createMeeting(meetingData) {
    try {
      const token = this.generateJWT();
      
      const response = await axios.post(`${this.baseURL}/users/me/meetings`, {
        topic: meetingData.title,
        agenda: meetingData.description,
        start_time: meetingData.startTime,
        duration: meetingData.duration,
        type: 2, // Scheduled meeting
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          waiting_room: true,
          auto_recording: 'local',
          ...meetingData.settings
        }
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        meeting: response.data
      };
    } catch (error) {
      console.error('Zoom API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Update a Zoom meeting
  async updateMeeting(meetingId, updateData) {
    try {
      const token = this.generateJWT();
      
      const response = await axios.patch(`${this.baseURL}/meetings/${meetingId}`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        meeting: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Delete a Zoom meeting
  async deleteMeeting(meetingId) {
    try {
      const token = this.generateJWT();
      
      await axios.delete(`${this.baseURL}/meetings/${meetingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Generate SDK signature for Zoom Web SDK
  generateSDKSignature(meetingId, role = 0) {
    const timestamp = Date.now();
    const payload = {
      iss: this.apiKey,
      exp: timestamp + 3600,
      iat: timestamp,
      aud: 'zoom',
      appKey: this.apiKey,
      tokenExp: timestamp + 3600,
      alg: 'HS256'
    };

    const signature = jwt.sign(payload, this.apiSecret);
    
    return {
      signature,
      meetingId,
      role,
      timestamp,
      expiresIn: 3600
    };
  }
}

module.exports = new ZoomService();
```

### **Step 5: Update Routes for Real Zoom API**

#### 5.1 Update Meeting Creation
Update `server/routes/zoomRoutes.js` to use real Zoom API:

```javascript
// Create a new Zoom meeting (REAL API)
router.post('/meetings', authenticate, roleMiddleware(['teacher', 'admin']), async (req, res) => {
  try {
    const { 
      title, 
      description, 
      courseId, 
      startTime, 
      duration = 60, 
      allowedStudents = [],
      settings = {}
    } = req.body;

    // Create meeting via real Zoom API
    const meetingData = {
      title,
      description,
      startTime: new Date(startTime).toISOString(),
      duration,
      settings
    };

    const zoomResult = await zoomService.createMeeting(meetingData);
    
    if (!zoomResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create Zoom meeting',
        error: zoomResult.error
      });
    }

    // Save to database
    const meeting = new ZoomMeeting({
      meetingId: zoomResult.meeting.id,
      topic: title,
      agenda: description,
      startTime: new Date(startTime),
      duration: duration,
      password: zoomResult.meeting.password,
      joinUrl: zoomResult.meeting.join_url,
      startUrl: zoomResult.meeting.start_url,
      hostId: req.user.id,
      course: courseId,
      allowedStudents: allowedStudents,
      status: 'scheduled',
      instructor: req.user.id,
      settings: settings
    });

    await meeting.save();
    await meeting.populate('course', 'title');
    await meeting.populate('instructor', 'firstName lastName');

    res.status(201).json({
      success: true,
      meeting: meeting,
      message: 'Meeting created successfully'
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### **Step 6: Real Zoom Web SDK Integration**

#### 6.1 Update ZoomMeeting Component
Update `client/src/components/ZoomMeeting.js`:

```javascript
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, message, Spin, Alert } from 'antd';
import { VideoCameraOutlined, PhoneOutlined, AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';
import zoomApiService from '../services/zoomApiService';

// Import Zoom Web SDK
import ZoomMtg from '@zoomus/websdk';

const ZoomMeeting = ({ 
  meetingId, 
  meetingData, 
  onMeetingEnd, 
  onAttendanceUpdate,
  isHost = false 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [error, setError] = useState(null);
  const [sdkSignature, setSdkSignature] = useState(null);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [participantCount, setParticipantCount] = useState(1);
  const zoomContainerRef = useRef(null);
  const zoomClientRef = useRef(null);

  useEffect(() => {
    initializeZoomSDK();
    return () => {
      if (zoomClientRef.current) {
        zoomClientRef.current.leave();
      }
    };
  }, [meetingId]);

  const initializeZoomSDK = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get SDK signature from backend
      const signatureResponse = await zoomApiService.getSDKSignature(
        meetingData.meetingId,
        isHost ? 1 : 0
      );

      if (!signatureResponse.success) {
        throw new Error(signatureResponse.message || 'Failed to get SDK signature');
      }

      setSdkSignature(signatureResponse.signature);

      // Configure Zoom SDK
      ZoomMtg.setZoomJSLib('https://source.zoom.us/2.0.0/lib', '/av');
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareWebSDK();

      // Initialize Zoom SDK
      ZoomMtg.init({
        leaveOnPageUnload: true,
        patchJsMedia: true,
        success: () => {
          console.log('Zoom SDK initialized successfully');
          joinMeeting();
        },
        error: (error) => {
          console.error('Zoom SDK initialization error:', error);
          setError('Failed to initialize Zoom SDK');
          setIsLoading(false);
        }
      });

    } catch (error) {
      console.error('Error initializing Zoom SDK:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const joinMeeting = () => {
    const meetingConfig = {
      sdkKey: process.env.REACT_APP_ZOOM_SDK_KEY,
      signature: sdkSignature,
      meetingNumber: meetingData.meetingId,
      password: meetingData.password,
      userName: isHost ? 'Host' : 'Participant',
      userEmail: 'user@example.com',
      tk: '',
      zak: '',
      success: (success) => {
        console.log('Meeting joined successfully');
        setIsJoined(true);
        setIsLoading(false);
        message.success(isHost ? 'Meeting started successfully!' : 'Joined meeting successfully!');
      },
      error: (error) => {
        console.error('Error joining meeting:', error);
        setError('Failed to join meeting');
        setIsLoading(false);
      }
    };

    ZoomMtg.join(meetingConfig);
  };

  // ... rest of the component remains the same
};
```

### **Step 7: Security Implementation**

#### 7.1 Authentication Middleware
Ensure proper authentication for all Zoom routes:

```javascript
// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
```

#### 7.2 Rate Limiting
Add rate limiting to prevent abuse:

```javascript
// server/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const zoomRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

module.exports = { zoomRateLimit };
```

### **Step 8: Deployment Configuration**

#### 8.1 Production Server Setup
```bash
# Install PM2 for process management
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'forum-academy-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 8.2 Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### **Step 9: Testing & Validation**

#### 9.1 Test Checklist
- [ ] Create a meeting via API
- [ ] Join meeting as host
- [ ] Join meeting as participant
- [ ] Test audio/video controls
- [ ] Test meeting recording
- [ ] Test meeting deletion
- [ ] Test access control
- [ ] Test error handling

#### 9.2 Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Create load test
cat > zoom-load-test.yml << EOF
config:
  target: 'https://api.yourdomain.com'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Create and join meetings"
    flow:
      - post:
          url: "/api/zoom/meetings"
          json:
            title: "Test Meeting"
            duration: 60
            startTime: "2024-01-01T10:00:00Z"
EOF

# Run load test
artillery run zoom-load-test.yml
```

### **Step 10: Monitoring & Maintenance**

#### 10.1 Logging
```javascript
// server/middleware/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

module.exports = logger;
```

#### 10.2 Health Checks
```javascript
// server/routes/health.js
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    zoom: {
      apiKey: !!process.env.ZOOM_API_KEY,
      apiSecret: !!process.env.ZOOM_API_SECRET
    }
  });
});
```

---

## 🎯 Benefits of Production Integration

### **✅ Data Persistence**
- Meetings survive server restarts
- No more data loss on refresh
- Reliable meeting history

### **✅ Real Zoom Features**
- Actual video/audio streaming
- Screen sharing capabilities
- Meeting recording
- Breakout rooms
- Waiting rooms

### **✅ Scalability**
- Handles multiple concurrent meetings
- Database-backed storage
- Load balancing support

### **✅ Security**
- JWT authentication
- Rate limiting
- Access control
- Secure API endpoints

### **✅ Production Ready**
- Error handling
- Logging
- Monitoring
- Health checks

---

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
cd server && npm install @zoomus/websdk jsonwebtoken axios
cd ../client && npm install @zoomus/websdk

# 2. Set environment variables
cp server/.env.example server/.env
# Edit server/.env with your Zoom credentials

# 3. Start development
npm run dev

# 4. Test the integration
# Create a meeting in Teacher Dashboard
# Join the meeting in Student Dashboard
```

---

## 📞 Support & Troubleshooting

### **Common Issues:**

1. **"Invalid JWT token"**
   - Check API key and secret
   - Verify token expiration
   - Ensure correct timezone

2. **"Meeting not found"**
   - Verify meeting ID format
   - Check database connection
   - Ensure meeting exists

3. **"SDK initialization failed"**
   - Check SDK key configuration
   - Verify network connectivity
   - Check browser console for errors

### **Debug Mode:**
```javascript
// Enable debug logging
process.env.ZOOM_DEBUG = 'true';
```

This comprehensive guide will transform your test implementation into a production-ready Zoom integration! 🎉
