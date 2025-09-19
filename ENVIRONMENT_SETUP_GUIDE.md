# 🌐 Forum Academy - Local & Azure Configuration Guide

This guide explains how to run the Forum Academy application with both **local development** and **Azure production** environments.

## 🏗️ Project Structure

```
forum-academy/
├── client/          # React frontend
│   └── .env         # Client environment configuration
├── server/          # Node.js backend
│   ├── .env         # Server environment configuration
│   └── test-db.js   # Database connection test script
├── switch-to-local.ps1   # Switch to local configuration
├── switch-to-azure.ps1   # Switch to Azure configuration
└── check-config.ps1      # Check current configuration
```

## 🔧 Configuration Modes

### 🏠 Local Development Mode
- **Database**: Local MongoDB (`mongodb://localhost:27017/forum-academy`)
- **Client URL**: `http://localhost:3000`
- **API URL**: `http://localhost:5000`
- **Use case**: Development and testing on your local machine

### 🌐 Azure Production Mode
- **Database**: Azure Cosmos DB (MongoDB API)
- **Client URL**: Azure Static Web Apps (`https://wonderful-meadow-0e35b381e.6.azurestaticapps.net`)
- **API URL**: Azure Web App (`https://forum-backend-api-a7hgg9g7hmgegrh3.eastasia-01.azurewebsites.net`)
- **Use case**: Production deployment and testing with cloud services

## 🚀 Quick Start

### Option 1: Using Switch Scripts (Recommended)

1. **Switch to Local Development:**
   ```powershell
   .\switch-to-local.ps1
   ```

2. **Switch to Azure Production:**
   ```powershell
   .\switch-to-azure.ps1
   ```

3. **Check Current Configuration:**
   ```powershell
   .\check-config.ps1
   ```

### Option 2: Manual Configuration

Edit the `.env` files manually by commenting/uncommenting the appropriate sections.

## 🏠 Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed locally OR Docker

### Step 1: Install MongoDB
Choose one option:

**Option A: MongoDB Community Edition**
1. Download from [MongoDB Official Site](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. Verify it's running on `mongodb://localhost:27017`

**Option B: Docker (Easier)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### Step 2: Switch to Local Configuration
```powershell
.\switch-to-local.ps1
```

### Step 3: Install Dependencies and Start
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Start both server and client
cd ..
npm run start:full  # Or start them separately
```

### Step 4: Verify Local Setup
1. Server should be running on `http://localhost:5000`
2. Client should be running on `http://localhost:3000`
3. Test database connection:
   ```bash
   cd server
   node test-db.js
   ```

## 🌐 Azure Production Setup

### Prerequisites
- Azure account with active subscription
- Azure Cosmos DB (MongoDB API) configured
- Azure Web App for backend
- Azure Static Web Apps for frontend

### Step 1: Switch to Azure Configuration
```powershell
.\switch-to-azure.ps1
```

### Step 2: Configure Email Service (Optional)
Edit `server/.env` and replace:
```properties
EMAIL_USER=forumacademy.notifications@gmail.com
EMAIL_PASS=your-actual-gmail-app-password
```

### Step 3: Test Azure Connection
```bash
cd server
node test-db.js
```

### Step 4: Deploy to Azure
1. **Backend**: Deploy `server/` folder to Azure Web App
2. **Frontend**: Deploy `client/` folder to Azure Static Web Apps

## 🧪 Testing Database Connections

### Test Current Configuration
```bash
cd server
node test-db.js
```

**Expected Output (Local):**
```
🔧 Testing Database Connection...
📍 MONGO_URI: mongodb://localhost:27017/forum-academy
🔌 Attempting to connect to MongoDB...
✅ Successfully connected to MongoDB!
```

**Expected Output (Azure):**
```
🔧 Testing Database Connection...
📍 MONGO_URI: mongodb+srv://Meshaka77:Forumteam2@forumacademy-db...
🔌 Attempting to connect to MongoDB...
✅ Successfully connected to MongoDB!
📊 Found collections: 16
```

## 📁 Environment File Details

### Server `.env` Structure
```properties
# LOCAL CONFIGURATION (Uncommented for local dev)
CLIENT_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/forum-academy

# AZURE CONFIGURATION (Uncommented for Azure deployment)
# CLIENT_URL=https://wonderful-meadow-0e35b381e.6.azurestaticapps.net
# MONGO_URI=mongodb+srv://...

# SHARED CONFIGURATION (Always active)
JWT_SECRET=your-super-secure-jwt-secret-key
PORT=5000
NODE_ENV=development
EMAIL_USER=forumacademy.notifications@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### Client `.env` Structure
```properties
# LOCAL CONFIGURATION (Uncommented for local dev)
REACT_APP_API_URL=http://localhost:5000

# AZURE CONFIGURATION (Uncommented for Azure deployment)
# REACT_APP_API_URL=https://forum-backend-api-a7hgg9g7hmgegrh3.eastasia-01.azurewebsites.net
```

## 🔍 Troubleshooting

### Common Issues

1. **"MongoDB connection failed"**
   - For local: Ensure MongoDB is running on port 27017
   - For Azure: Check Cosmos DB connection string and credentials

2. **"CORS errors in browser"**
   - Verify CLIENT_URL matches your frontend URL
   - Check if both client and server configurations match

3. **"Cannot reach API"**
   - Verify REACT_APP_API_URL in client matches server URL
   - Check if server is running and accessible

### Useful Commands

```bash
# Check which ports are in use
netstat -an | findstr :3000
netstat -an | findstr :5000

# Restart MongoDB (Windows)
net stop MongoDB
net start MongoDB

# View server logs
cd server
npm start

# View client logs
cd client
npm start
```

## 🛡️ Security Notes

1. **Never commit real credentials** to version control
2. **Use environment-specific credentials** for each deployment
3. **Regularly rotate passwords** and access keys
4. **Use HTTPS in production** (Azure handles this automatically)

## 📞 Support

If you encounter issues:
1. Check the configuration with `.\check-config.ps1`
2. Test database connection with `cd server && node test-db.js`
3. Verify all environment variables are set correctly
4. Check server and client logs for detailed error messages

---

✅ **Your Forum Academy application is now configured to work with both local and Azure environments!**