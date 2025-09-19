# 📋 TEST GUIDE: File Upload System

## 🔐 Login Credentials
- **Email**: admin@example.com
- **Password**: admin123

## 🚀 How to Test File Upload

1. **Access the App**: http://localhost:3000
2. **Click "Login"** in the header
3. **Enter Credentials**:
   - Email: admin@example.com
   - Password: admin123
4. **Navigate to Admin Dashboard**: After login, go to `/admin/dashboard`
5. **Go to Course Materials** tab

## 📁 Upload Files

1. **Click "Upload Material"** button
2. **Fill in the form**:
   - Title: Enter a descriptive title
   - Description: Optional description
   - Course: Select from existing courses
   - Category: Choose appropriate category
   - Week/Lesson: Optional organization
   - Access Level: Who can access the file
3. **Upload File**: 
   - Drag and drop OR click to select
   - Supported formats: PDF, videos, audio, documents
   - Max size: 100MB
4. **Click "OK"** to upload

## ✅ What Should Happen

- File uploads to server directory: `server/uploads/course-materials/`
- Data saves to MongoDB with metadata
- File appears in materials list immediately
- File persists after page refresh
- Download functionality works

## 🔧 Backend Status
- Server running on: http://localhost:5000
- Frontend running on: http://localhost:3001
- Database: MongoDB (populated with sample data)
- Upload directory: Created and ready

## 📊 Sample Data Available
- ✅ 5 Courses (ENG101, BUS201, TECH301, JAP101, ADV401)
- ✅ 10 Materials (PDFs and videos for each course)
- ✅ Admin user with proper permissions

## 🐛 If Upload Fails
Check browser console for errors and verify:
1. Authentication token is present
2. File size is under 100MB
3. File type is supported
4. Course is selected
5. Required fields are filled

The system is now configured for REAL file uploads with proper MongoDB persistence!
