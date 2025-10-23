# Azure Backend Deployment Fix Guide

## Problem
The Azure backend (`forum-backend-cnfrb6eubggucqda.canadacentral-01.azurewebsites.net`) is **NOT** showing the latest routes:
- ❌ Missing: `/api/zoom/*`
- ❌ Missing: `/api/notifications/*`

Current available routes on Azure:
```json
{
  "availableRoutes": [
    "/api/health",
    "/api/test-db",
    "/api/auth/*",
    "/api/users/*",
    "/api/applications/*",
    "/api/contact/*",
    "/api/admin/*",
    "/api/quizzes/*",
    "/api/courses/*",
    "/api/homework/*",
    "/api/homework-submissions/*",
    "/api/course-materials/*",
    "/api/progress/*",
    "/api/announcements/*",
    "/api/analytics/*"
  ]
}
```

## Root Cause
Azure Web App is **NOT automatically deploying** when you push to GitHub. The backend is running **old code**.

## Solution Options

### Option 1: Manual Deployment via Azure Portal (IMMEDIATE FIX)

1. **Go to Azure Portal**: https://portal.azure.com
2. **Navigate to**: App Services → `forum-backend-cnfrb6eubggucqda`
3. **Deployment Center** (left sidebar)
4. **Click "Sync"** or **"Redeploy"** button
5. **Wait 2-3 minutes** for deployment to complete
6. **Verify**: Visit `https://forum-backend-cnfrb6eubggucqda.canadacentral-01.azurewebsites.net/api/health`
   - Should now show `/api/zoom/*` and `/api/notifications/*`

### Option 2: Configure Continuous Deployment from GitHub

#### Step 1: Get Publish Profile
1. Go to Azure Portal → `forum-backend-cnfrb6eubggucqda`
2. Click **"Get publish profile"** (top toolbar)
3. Download the `.PublishSettings` file
4. Open it and copy the entire XML content

#### Step 2: Add GitHub Secret
1. Go to GitHub: https://github.com/dishnhtm1/forum-academy
2. Settings → Secrets and variables → Actions
3. Click **"New repository secret"**
4. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
5. Value: Paste the entire publish profile XML
6. Click **"Add secret"**

#### Step 3: Trigger Deployment
The workflow `.github/workflows/azure-backend-deploy.yml` is already created.
Once the secret is added, it will auto-deploy on every push to `server/` folder.

### Option 3: Enable Azure GitHub Integration

1. **Go to**: Azure Portal → `forum-backend-cnfrb6eubggucqda`
2. **Deployment Center** → **Settings**
3. **Source**: Select "GitHub"
4. **Authenticate** with GitHub
5. **Repository**: Select `dishnhtm1/forum-academy`
6. **Branch**: `master`
7. **Build Provider**: "GitHub Actions"
8. **Folder**: `/server`
9. **Click "Save"**

This will create a GitHub Actions workflow automatically.

## Verification Steps

After deployment, run these commands:

### 1. Check Health Endpoint
```powershell
curl https://forum-backend-cnfrb6eubggucqda.canadacentral-01.azurewebsites.net/api/health
```

Should show:
```json
{
  "routes": [
    "...",
    "/api/zoom/*",
    "/api/notifications/*"
  ]
}
```

### 2. Test Zoom Route
```powershell
curl https://forum-backend-cnfrb6eubggucqda.canadacentral-01.azurewebsites.net/api/zoom/meetings
```

Should return authentication error (not 404):
```json
{
  "message": "Access denied. Admin or teacher role required."
}
```

### 3. Test Notifications Route
```powershell
curl https://forum-backend-cnfrb6eubggucqda.canadacentral-01.azurewebsites.net/api/notifications/test
```

Should return test notifications (not 404).

## Quick Manual Deploy via VS Code (Alternative)

If you have Azure Tools extension installed:

1. Install: `Azure App Service` extension in VS Code
2. Sign in to Azure
3. Right-click `forum-backend-cnfrb6eubggucqda`
4. Select **"Deploy to Web App"**
5. Choose the `server` folder
6. Confirm deployment

## Environment Variables Check

Make sure these are set in Azure:

1. Go to Azure Portal → `forum-backend-cnfrb6eubggucqda`
2. **Configuration** → **Application settings**
3. Verify these variables exist:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `ZOOM_ACCOUNT_ID`
   - `ZOOM_CLIENT_ID`
   - `ZOOM_CLIENT_SECRET`
   - `PORT` (should be 8080 or not set for Azure default)

## Current Status

- ✅ Code is pushed to GitHub (latest commit: `01521f13e`)
- ✅ Routes are properly configured in `server.js`
- ✅ GitHub Actions workflow created
- ❌ Azure backend NOT updated yet
- ⏳ **ACTION REQUIRED**: Deploy using one of the options above

## Expected Timeline

- **Manual Sync**: 2-3 minutes
- **GitHub Actions (first time)**: 5-10 minutes
- **Continuous Deployment (auto)**: Deploys on every push automatically

---

## Next Steps

1. **IMMEDIATE**: Use Option 1 (Manual Sync) for fastest results
2. **LONG-TERM**: Configure Option 2 or 3 for automatic deployments
3. **VERIFY**: Run verification commands after deployment
4. **TEST**: Try creating a Zoom meeting from teacher dashboard
