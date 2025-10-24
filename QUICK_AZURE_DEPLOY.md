# ⚡ QUICK FIX: Deploy Backend to Azure (5 Minutes)

## The Problem

Your Zoom routes return **404 Not Found** because Azure is running **OLD CODE**.

Current Azure routes (MISSING zoom and notifications):

```
/api/health, /api/auth/*, /api/users/*, etc.
❌ NO /api/zoom/*
❌ NO /api/notifications/*
```

## ✅ Solution: Sync Deployment in Azure Portal

### Step-by-Step (With Exact Clicks)

#### 1. Open Azure Portal

Go to: **https://portal.azure.com**

#### 2. Find Your Backend App

- In search bar (top), type: `forum-backend-cnfrb6eubggucqda`
- Click on the App Service that appears

#### 3. Go to Deployment Center

- In the LEFT sidebar, scroll down
- Click: **"Deployment Center"**

#### 4. Check Current Setup

You'll see one of these scenarios:

**Scenario A: GitHub Connected**

- Source: GitHub
- Repository: dishnhtm1/forum-academy
- Branch: master
- ➡️ **Click "Sync" button** at the top
- ➡️ Wait 2-3 minutes
- ➡️ Done! Skip to verification.

**Scenario B: No Source Connected**

- You'll see "External Git" or "Not configured"
- ➡️ **Click "Settings" tab**
- ➡️ **Source**: Select "GitHub"
- ➡️ **Authenticate** with GitHub (popup will appear)
- ➡️ **Organization**: Select your GitHub username
- ➡️ **Repository**: Select `forum-academy`
- ➡️ **Branch**: Select `master`
- ➡️ **Click "Save"** at top
- ➡️ It will auto-deploy (5-10 minutes)

#### 5. Monitor Deployment

- Stay on Deployment Center page
- Click **"Logs" tab**
- Watch for:
  ```
  Building...
  Deploying...
  Deployment successful
  ```

#### 6. Verify It Worked

Open this URL in browser:

```
https://forum-backend-cnfrb6eubggucqda.canadacentral-01.azurewebsites.net/api/health
```

You should see:

```json
{
  "status": "ok",
  "routes": [
    "...",
    "/api/zoom/*",        ← SHOULD BE HERE NOW
    "/api/notifications/*" ← SHOULD BE HERE NOW
  ]
}
```

## Alternative: Use PowerShell Script

If you prefer automation:

1. Open PowerShell in your project folder
2. Run:
   ```powershell
   .\deploy-backend-to-azure.ps1
   ```
3. Follow the prompts
4. Wait for completion

## Troubleshooting

### "Sync button is disabled"

➡️ Deployment Center → Settings → Disconnect → Reconnect GitHub

### "Still getting 404 after sync"

1. Check deployment logs for errors
2. Go to **Configuration** → **Application settings**
3. Verify these exist:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `ZOOM_ACCOUNT_ID`
   - `ZOOM_CLIENT_ID`
   - `ZOOM_CLIENT_SECRET`

### "Deployment failed"

1. Go to **Log stream** (left sidebar)
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - Node.js version mismatch
   - npm install errors

## Expected Results

After deployment:

✅ Zoom meetings will work
✅ Notifications will work
✅ No more 404 errors
✅ Teacher dashboard can create live classes

## Time Required

- **Manual Sync**: 2-3 minutes
- **First-time Setup**: 10 minutes
- **Future Deployments**: Automatic on every push

---

## Need Help?

If still stuck, check:

1. **Log Stream** in Azure Portal (real-time logs)
2. **Application Insights** (if enabled)
3. Server logs show route loading messages

The code is correct and works locally. This is purely a deployment issue! 🚀
