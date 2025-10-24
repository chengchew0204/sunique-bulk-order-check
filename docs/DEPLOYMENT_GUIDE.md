# Deployment Guide

This guide walks you through deploying the Bulk Order Checking System with the backend on Railway and the frontend on Netlify.

## Prerequisites

- Git repository with your code
- Railway account (https://railway.app/)
- Netlify account (https://www.netlify.com/)
- GitHub account (recommended for both deployments)

## Part 1: Deploy Backend to Railway

### Step 1: Prepare Your Backend

The backend is already configured with the necessary files:
- `Procfile`: Tells Railway how to run the app
- `runtime.txt`: Specifies Python version
- `railway.json`: Railway-specific configuration
- `requirements.txt`: Python dependencies

### Step 2: Create Railway Project

1. Go to https://railway.app/ and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account if not already connected
5. Select your repository
6. Railway will detect it's a Python app automatically

### Step 3: Configure Environment Variables

In your Railway project dashboard:

1. Click on your service
2. Go to "Variables" tab
3. Add the following environment variables:

```
SHAREPOINT_TENANT_ID=your_tenant_id
SHAREPOINT_CLIENT_ID=your_client_id
SHAREPOINT_CLIENT_SECRET=your_client_secret
SHAREPOINT_OBJECT_ID=your_object_id
SHAREPOINT_HOSTNAME=suniquecabinetry.sharepoint.com
SHAREPOINT_SITE_NAME=sccr

INFLOW_COMPANY_ID=your_company_id
INFLOW_API_KEY=your_api_key

EMAIL_CLIENT_ID=your_email_client_id
EMAIL_CLIENT_SECRET=your_email_client_secret
EMAIL_CLIENT_SECRET_VALUE=your_email_secret_value
EMAIL_TENANT_ID=your_email_tenant_id

SECRET_KEY=your_production_secret_key_here
```

**Important:** Use strong, unique values for production. Never commit these to your repository.

### Step 4: Set Python Path

Railway needs to know where your backend code is:

1. In your Railway service settings, add a new variable:
   ```
   RAILWAY_RUN_DIR=/app/backend
   ```

2. Or update your `railway.json` with the correct path:
   ```json
   {
     "build": {
       "builder": "NIXPACKS",
       "buildCommand": "cd backend && pip install -r requirements.txt"
     },
     "deploy": {
       "startCommand": "cd backend && gunicorn app:app --bind 0.0.0.0:$PORT"
     }
   }
   ```

### Step 5: Deploy

1. Railway will automatically deploy your app
2. Monitor the deployment logs for any errors
3. Once deployed, you'll get a URL like: `https://your-app-name.railway.app`
4. Test your backend by visiting: `https://your-app-name.railway.app/api/health`
5. You should see: `{"status": "ok", "message": "Bulk Order API is running"}`

### Step 6: Note Your Backend URL

Copy your Railway backend URL (without `/api`). You'll need this for Netlify configuration.
Example: `https://your-app-name.railway.app`

---

## Part 2: Deploy Frontend to Netlify

### Step 1: Prepare Frontend Files

The frontend is already configured with:
- `netlify.toml`: Netlify configuration
- `build-env.sh`: Build script to inject API URL
- `_headers`: CORS headers configuration
- Updated `script.js`: Uses dynamic API URL

### Step 2: Create Netlify Site

1. Go to https://www.netlify.com/ and sign in
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub recommended)
4. Select your repository
5. Configure build settings:
   - **Base directory:** `development-local`
   - **Build command:** `bash build-env.sh`
   - **Publish directory:** `.`

### Step 3: Configure Environment Variables

Before deploying, add your Railway backend URL:

1. In Netlify site settings, go to "Environment variables"
2. Add the following variable:
   ```
   API_BASE_URL=https://your-app-name.railway.app/api
   ```
   (Replace with your actual Railway URL from Part 1, Step 6)

### Step 4: Deploy

1. Click "Deploy site"
2. Netlify will build and deploy your frontend
3. You'll get a URL like: `https://random-name-123456.netlify.app`
4. You can customize this URL in Site settings → Domain management

### Step 5: Test Your Deployment

1. Visit your Netlify URL
2. Try uploading a bulk order Excel file
3. Verify that it processes correctly and displays results
4. Test the Excel download functionality

---

## Part 3: Post-Deployment Configuration

### Update CORS Settings on Railway (If Needed)

If you encounter CORS issues:

1. The backend already has `Flask-CORS` configured to allow all origins
2. For production, you may want to restrict this to your Netlify domain
3. Edit `backend/app.py`:
   ```python
   CORS(app, resources={r"/api/*": {"origins": "https://your-netlify-site.netlify.app"}})
   ```

### Custom Domain (Optional)

#### For Netlify:
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow instructions to configure DNS

#### For Railway:
1. Go to your service settings
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update your Netlify `API_BASE_URL` environment variable

---

## Troubleshooting

### Backend Issues

**Problem:** Railway deployment fails
- Check the deployment logs in Railway dashboard
- Ensure all required environment variables are set
- Verify `requirements.txt` has all dependencies

**Problem:** API returns 500 errors
- Check Railway logs for detailed error messages
- Verify SharePoint and inFlow credentials are correct
- Ensure all required environment variables are set

**Problem:** File upload fails
- Railway has a default timeout of 300s for HTTP requests
- For large files, you may need to increase this in Railway settings

### Frontend Issues

**Problem:** "Failed to fetch" errors
- Verify the `API_BASE_URL` environment variable in Netlify is correct
- Check browser console for CORS errors
- Ensure Railway backend is running (check health endpoint)

**Problem:** Build fails on Netlify
- Check build logs in Netlify dashboard
- Verify `build-env.sh` has execute permissions
- Ensure the base directory is set to `development-local`

**Problem:** Environment variable not updating
- After changing environment variables, trigger a new deploy
- Clear browser cache or use incognito mode to test

### CORS Issues

If you see CORS errors in the browser console:

1. Verify Railway backend has Flask-CORS installed
2. Check that `_headers` file is in the Netlify deploy directory
3. Ensure the API URL is correct (no trailing slash issues)

---

## Monitoring and Maintenance

### Railway
- Monitor logs in Railway dashboard
- Set up alerts for errors or downtime
- Review metrics for performance

### Netlify
- Monitor build logs for successful deployments
- Check analytics for usage patterns
- Set up deploy notifications

---

## Updating Your Deployment

### Backend Updates
1. Push changes to your GitHub repository
2. Railway will automatically redeploy
3. Monitor deployment logs

### Frontend Updates
1. Push changes to your GitHub repository
2. Netlify will automatically rebuild and redeploy
3. Monitor build logs

### Environment Variable Changes
1. Update variables in Railway/Netlify dashboard
2. Trigger a manual redeploy for changes to take effect

---

## Security Best Practices

1. **Never commit secrets** to your repository
2. **Use environment variables** for all sensitive data
3. **Regularly rotate** API keys and secrets
4. **Enable HTTPS** (both Railway and Netlify provide this by default)
5. **Restrict CORS** to specific domains in production
6. **Monitor logs** for suspicious activity
7. **Keep dependencies updated** regularly

---

## Cost Considerations

### Railway
- Free tier: $5 credit per month
- Usage-based pricing after free tier
- Estimated cost for low traffic: $5-20/month

### Netlify
- Free tier: 100GB bandwidth, 300 build minutes/month
- Estimated cost for low traffic: Free
- Upgrade if needed for more bandwidth

---

## Support

If you encounter issues:
1. Check Railway and Netlify status pages
2. Review deployment logs carefully
3. Test API endpoints individually
4. Use browser developer tools to debug frontend issues

---

## Summary Checklist

### Railway Deployment
- [ ] Create Railway project from GitHub
- [ ] Configure all environment variables
- [ ] Verify deployment succeeds
- [ ] Test API health endpoint
- [ ] Note backend URL

### Netlify Deployment
- [ ] Create Netlify site from GitHub
- [ ] Set base directory to `development-local`
- [ ] Configure `API_BASE_URL` environment variable
- [ ] Verify build succeeds
- [ ] Test frontend functionality
- [ ] Test end-to-end flow (upload → process → download)

### Post-Deployment
- [ ] Test with real data
- [ ] Set up monitoring
- [ ] Configure custom domains (optional)
- [ ] Document any environment-specific settings
- [ ] Share URLs with team

---

## Quick Reference

### Railway Backend URL Format
```
https://your-app-name.railway.app
```

### Netlify Frontend URL Format
```
https://your-site-name.netlify.app
```

### Environment Variable Template
```bash
# Railway Backend
SHAREPOINT_TENANT_ID=...
SHAREPOINT_CLIENT_ID=...
SHAREPOINT_CLIENT_SECRET=...
SHAREPOINT_OBJECT_ID=...
INFLOW_COMPANY_ID=...
INFLOW_API_KEY=...
SECRET_KEY=...

# Netlify Frontend
API_BASE_URL=https://your-railway-backend.railway.app/api
```

---

**Deployment Date:** [Add date when deployed]
**Deployed By:** [Add your name]
**Last Updated:** [Add date]

