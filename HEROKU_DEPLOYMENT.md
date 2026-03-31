# 🚀 Heroku Deployment Guide

## Prerequisites
✅ Heroku CLI installed
✅ Git initialized (done)
✅ Project committed to git (done)

## Step-by-Step Deployment

### 1. Login to Heroku
```powershell
heroku login
```
This opens your browser for authentication.

### 2. Create Heroku App
```powershell
heroku create your-app-name
```
**Examples:**
- `heroku create my-url-shortener`
- `heroku create url-short-2026`
- `heroku create super-short-urls`

**Note:** App names must be unique globally.

### 3. Add MongoDB Database
```powershell
heroku addons:create mongolab:sandbox
```

This automatically creates:
- Free MongoDB Atlas database
- Sets `MONGODB_URI` environment variable

### 4. Configure Environment Variables
The MONGODB_URI is auto-set. For production, optionally set:
```powershell
heroku config:set BASE_URL=https://your-app-name.herokuapp.com
heroku config:set SHORT_CODE_LENGTH=6
heroku config:set NODE_ENV=production
```

### 5. Deploy to Heroku
```powershell
git push heroku master
```

This will:
- Build your app on Heroku
- Install dependencies
- Start the server
- Give you a live URL

### 6. Open Your App
```powershell
heroku open
```

Or visit:
```
https://your-app-name.herokuapp.com
```

### 7. View Logs
```powershell
# Real-time logs
heroku logs --tail

# Last 50 lines
heroku logs

# Filter by errors
heroku logs --tail --grep ERROR
```

---

## ✨ Features After Deployment

✅ **Live Web UI** - Access from anywhere
✅ **Working API** - All endpoints active
✅ **MongoDB** - Free tier included
✅ **SSL/HTTPS** - Automatic
✅ **Custom Domain** - Optional (paid)

---

## 📊 Monitoring

### Check App Status
```powershell
heroku ps
```

### Check Environment Variables
```powershell
heroku config
```

### Scale Your App
```powershell
heroku ps:scale web=1
```

### Restart App
```powershell
heroku restart
```

---

## 🔧 Common Issues & Solutions

### Issue: "App name already taken"
**Solution:** Choose a different unique name

### Issue: MongoDB connection error
**Solution:** Run `heroku addons:create mongolab:sandbox`

### Issue: Port error
**Solution:** App uses PORT env variable (Heroku sets this automatically)

### Issue: Static files not loading
**Solution:** Ensure `public/` folder is committed to git

---

## 💰 Pricing

**Free Tier:**
- App: Free dyno (512MB RAM)
- MongoDB: 0.5GB free tier
- Cost: $0/month

**After Free Trial:**
- Heroku dynos: $7-50/month
- MongoDB: Depends on usage (0.5GB free)

---

## 🌟 Next Steps After Deployment

1. **Get your app URL from Heroku**
   ```powershell
   heroku apps
   ```

2. **Test your deployed app**
   ```
   https://your-app-name.herokuapp.com/
   ```

3. **Create a short URL via deployed app**
   - Use the web UI
   - Or API: `POST https://your-app-name.herokuapp.com/api/urls`

4. **Share your short links!**

---

## 📚 Useful Commands

```powershell
# View all your apps
heroku apps

# Connect to MongoDB shell
heroku config:get MONGODB_URI

# Scale dynos
heroku ps:scale web=2

# Add custom domain
heroku domains:add myurl.com

# View billing
heroku billing

# Deploy from different branch
git push heroku develop:master

# Rollback to previous release
heroku releases:rollback
```

---

## ✅ Deployment Checklist

- [ ] Heroku CLI installed
- [ ] Git initialized and committed
- [ ] Heroku account created
- [ ] Logged in to Heroku: `heroku login`
- [ ] App created: `heroku create app-name`
- [ ] MongoDB addon added: `heroku addons:create mongolab:sandbox`
- [ ] Deployed: `git push heroku master`
- [ ] Approved logs: `heroku logs --tail`
- [ ] App opened: `heroku open`
- [ ] Tested UI: Create a short URL
- [ ] Shared URL: Test the redirect

---

## 🎉 Congratulations!

Your URL shortener is now **live on the internet!** 🚀

Share your URL with:
```
https://your-app-name.herokuapp.com
```

---

**Need help?** Check logs with: `heroku logs --tail`
