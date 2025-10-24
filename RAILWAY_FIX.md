# Railway Deployment Fix

## Issue
Railway was trying to build from the root directory but couldn't find `pip` because the backend code is in the `backend/` subdirectory.

## Solution Applied
Created configuration files at the root level (`development-local/`) that tell Railway to work with the `backend/` subdirectory:

1. ✅ `railway.json` - Points Railway to backend directory
2. ✅ `nixpacks.toml` - Configures build to install dependencies from backend/
3. ✅ `Procfile` - Tells Railway to run app from backend/

## What to Do Now

### Option 1: Redeploy on Railway (Recommended)
1. Commit and push these changes to GitHub:
   ```bash
   git add .
   git commit -m "Fix Railway deployment configuration"
   git push
   ```

2. Railway will automatically redeploy with the new configuration

3. Monitor the build logs - should now work!

### Option 2: Configure Railway Service Settings

Alternatively, in your Railway project:

1. Go to your service settings
2. Click on "Settings" tab
3. Under "Root Directory", set it to: `backend`
4. Redeploy

This tells Railway to treat the `backend/` directory as the root for building and deploying.

## Verification

After deployment succeeds, test:
```bash
curl https://your-railway-app.railway.app/api/health
```

Should return:
```json
{"status": "ok", "message": "Bulk Order API is running"}
```

## Files Structure

Now you have deployment configs in two places:

### Root Level (development-local/)
```
development-local/
├── railway.json       ← Main Railway config
├── nixpacks.toml      ← Build configuration
├── Procfile           ← Process configuration
```

### Backend Level (for reference)
```
backend/
├── railway.json       ← Backup config
├── nixpacks.toml      ← Backup config  
├── Procfile           ← Backup config
```

Railway will use the root-level configs first.

## Still Having Issues?

### Error: "pip: command not found"
**Solution:** Make sure the root-level `nixpacks.toml` includes `pip` in nixPkgs:
```toml
[phases.setup]
nixPkgs = ["python39", "pip"]
```

### Error: "requirements.txt not found"
**Solution:** The install commands should change directory first:
```toml
[phases.install]
cmds = ["cd backend && python -m pip install -r requirements.txt"]
```

### Error: "app module not found"
**Solution:** Make sure start command includes `cd backend`:
```toml
[start]
cmd = "cd backend && gunicorn app:app --bind 0.0.0.0:$PORT"
```

## Alternative: Root Directory Setting in Railway

The cleanest approach is to set the root directory in Railway UI:

1. Railway Dashboard → Your Service
2. Settings → Root Directory
3. Enter: `backend`
4. Redeploy

This way Railway treats `backend/` as the root, and you can use the original simple configs.

---

**Note:** After fixing, the deployment should complete successfully in 2-3 minutes.

