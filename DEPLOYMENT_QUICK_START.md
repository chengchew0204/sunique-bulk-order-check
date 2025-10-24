# Quick Start Deployment Guide

This is a simplified guide to get your app deployed quickly. For detailed instructions, see `docs/DEPLOYMENT_GUIDE.md`.

## 🚀 Deploy Backend to Railway (5 minutes)

1. **Create Project**
   - Go to https://railway.app/
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Set Root Directory**
   - In Railway project settings, add variable:
     ```
     RAILWAY_RUN_DIR=/app/backend
     ```
   - Or update `railway.json` to specify backend directory

3. **Add Environment Variables**
   - Copy all variables from `backend/.env.example`
   - Replace placeholder values with real credentials
   - Add them in Railway "Variables" tab

4. **Deploy**
   - Railway will auto-deploy
   - Wait for deployment to complete
   - Copy your Railway URL: `https://your-app.railway.app`

5. **Test**
   - Visit: `https://your-app.railway.app/api/health`
   - Should return: `{"status": "ok", "message": "Bulk Order API is running"}`

---

## 🌐 Deploy Frontend to Netlify (3 minutes)

1. **Create Site**
   - Go to https://www.netlify.com/
   - Click "Add new site" → "Import from Git"
   - Select your repository

2. **Configure Build**
   - Base directory: `development-local`
   - Build command: `bash build-env.sh`
   - Publish directory: `.`

3. **Add Environment Variable**
   - In Netlify site settings → "Environment variables"
   - Add:
     ```
     API_BASE_URL=https://your-railway-app.railway.app/api
     ```
   - Use your Railway URL from step above (with `/api` at the end)

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Visit your Netlify URL

5. **Test**
   - Upload a test Excel file
   - Verify processing works
   - Download results

---

## ✅ Verification Checklist

- [ ] Railway backend URL works: `https://your-app.railway.app/api/health`
- [ ] Netlify frontend loads correctly
- [ ] Can upload Excel file
- [ ] Processing completes successfully
- [ ] Results display correctly
- [ ] Can download Excel results

---

## 🔧 Common Issues

**Backend won't start:**
- Check Railway logs for errors
- Verify all environment variables are set
- Make sure Python version matches `runtime.txt`

**Frontend can't connect to backend:**
- Check `API_BASE_URL` in Netlify environment variables
- Verify Railway backend is running
- Check browser console for CORS errors

**Build fails on Netlify:**
- Check build logs
- Verify `build-env.sh` exists
- Make sure base directory is set to `development-local`

---

## 📝 Next Steps

1. **Custom Domains** (Optional)
   - Configure custom domain in Railway
   - Configure custom domain in Netlify
   - Update `API_BASE_URL` to use custom domain

2. **Monitoring**
   - Set up Railway log monitoring
   - Enable Netlify analytics
   - Configure error notifications

3. **Security**
   - Review and restrict CORS settings
   - Rotate secrets regularly
   - Enable additional security headers

---

## 📚 Additional Resources

- Full deployment guide: `docs/DEPLOYMENT_GUIDE.md`
- Setup guide: `docs/SETUP_GUIDE.md`
- Testing guide: `docs/TESTING.md`

---

**Need Help?**
- Railway Docs: https://docs.railway.app/
- Netlify Docs: https://docs.netlify.com/
- Check `docs/DEPLOYMENT_GUIDE.md` for troubleshooting

