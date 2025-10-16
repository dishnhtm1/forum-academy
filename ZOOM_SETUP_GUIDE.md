# Zoom Integration Setup Guide

## Prerequisites

1. **Zoom Account**: You need a Zoom account with API access
2. **Zoom App**: Create a JWT app in your Zoom marketplace
3. **Environment Variables**: Set up the required environment variables

## Step 1: Create Zoom JWT App

1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Sign in with your Zoom account
3. Click "Develop" → "Build App"
4. Choose "JWT" as the app type
5. Fill in the app information:
   - App Name: "Forum Academy Live Classes"
   - Company Name: Your company name
   - Developer Email: Your email
6. After creation, go to "App Credentials"
7. Copy your **API Key** and **API Secret**

## Step 2: Environment Variables

Add these variables to your `server/.env` file:

```env
# Zoom API Configuration (REQUIRED)
ZOOM_API_KEY=your-zoom-api-key-here
ZOOM_API_SECRET=your-zoom-api-secret-here
```

## Step 3: Install Frontend Dependencies

```bash
cd client
npm install @zoomus/websdk
```

## Step 4: API Endpoints

The following endpoints are now available:

### Teacher Endpoints (Requires teacher/admin role)
- `GET /api/zoom/meetings` - Get all meetings for a teacher
- `POST /api/zoom/meetings` - Create a new meeting
- `PUT /api/zoom/meetings/:id` - Update a meeting
- `DELETE /api/zoom/meetings/:id` - Delete a meeting
- `POST /api/zoom/meetings/:id/start` - Start a meeting
- `POST /api/zoom/meetings/:id/end` - End a meeting

### Student Endpoints
- `GET /api/zoom/meetings/:id` - Get meeting details
- `POST /api/zoom/meetings/:id/join` - Join a meeting
- `GET /api/zoom/meetings/:id/attendance` - Get attendance records

### SDK Endpoints
- `GET /api/zoom/sdk-signature/:meetingId` - Get SDK signature for frontend

## Step 5: Database Models

Two new models have been created:

### ZoomMeeting Model
- Stores meeting information
- Tracks attendance in real-time
- Links to courses and students

### AttendanceRecord Model
- Stores detailed attendance records
- Tracks join/leave times
- Calculates attendance percentages

## Step 6: Frontend Integration

The frontend will need to be updated to:

1. **Install Zoom Web SDK**:
   ```bash
   npm install @zoomus/websdk
   ```

2. **Replace mock data** with real API calls
3. **Integrate Zoom Web SDK** for embedded meetings
4. **Implement real-time attendance tracking**

## Step 7: Security Features

- **JWT Authentication**: All endpoints require valid JWT tokens
- **Role-based Access**: Teachers can manage meetings, students can join
- **Permission Checks**: Students can only join meetings they're invited to
- **Meeting Validation**: Prevents unauthorized access to meetings

## Step 8: Real-time Features

- **WebSocket Integration**: For real-time attendance updates
- **Live Status Updates**: Meeting status changes in real-time
- **Attendance Tracking**: Automatic join/leave detection

## Production Deployment

1. **Set Environment Variables**: Ensure all Zoom API credentials are set
2. **Database Migration**: The new models will be created automatically
3. **SSL Certificate**: Required for Zoom Web SDK in production
4. **Domain Verification**: Zoom may require domain verification

## Testing

1. **Create a Test Meeting**: Use the API to create a meeting
2. **Join Meeting**: Test joining from both teacher and student perspectives
3. **Attendance Tracking**: Verify attendance is recorded correctly
4. **End Meeting**: Test meeting end and report generation

## Troubleshooting

### Common Issues:

1. **"Invalid API Key"**: Check your Zoom API credentials
2. **"Meeting not found"**: Ensure meeting exists in database
3. **"Access denied"**: Check user permissions and meeting access
4. **"SDK signature error"**: Verify JWT token generation

### Debug Mode:

Enable debug logging by setting:
```env
NODE_ENV=development
```

## Next Steps

1. **Frontend Integration**: Update the React components to use real APIs
2. **WebSocket Implementation**: Add real-time features
3. **UI/UX Improvements**: Enhance the meeting interface
4. **Mobile Support**: Ensure mobile compatibility
5. **Recording Integration**: Add meeting recording features

## Support

For issues with:
- **Zoom API**: Check [Zoom API Documentation](https://marketplace.zoom.us/docs/api-reference)
- **Integration**: Check server logs for detailed error messages
- **Database**: Verify MongoDB connection and model creation
