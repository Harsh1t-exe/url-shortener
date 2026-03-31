# MongoDB Connection String - READY TO USE

## Your Complete Connection String:

```
mongodb+srv://url_shortener_user:9v0kfzYiaomWgA6r@cluster0w.bgol8to.mongodb.net/url-shortener?retryWrites=true&w=majority
```

## Step-by-Step: Update Render 🚀

### 1️⃣ Go to Render Dashboard
- Open: https://dashboard.render.com
- Find your "url-shortener" service
- Click on it

### 2️⃣ Open Environment Settings
- Click the **"Environment"** tab in the sidebar
- Look for the `MONGODB_URI` variable

### 3️⃣ Update the Variable
**OLD (DELETE THIS):**
```
mongodb+srv://hk817083_db_user:wiIFFppG1q6x8ixt@cluster0w.bgol8to.mongodb.net/url-shortener
```

**NEW (PASTE THIS):**
```
mongodb+srv://url_shortener_user:9v0kfzYiaomWgA6r@cluster0w.bgol8to.mongodb.net/url-shortener?retryWrites=true&w=majority
```

### 4️⃣ Save Changes
- Click **"Save Changes"** button
- Render will auto-redeploy! (takes 2-3 minutes)

### 5️⃣ Check Deployment Status
- Go to **"Logs"** tab
- Wait for the green checkmark ✓
- Look for: `✓ Connected to MongoDB`

---

## What Changed? 🔍

| Part | Old | New | Why |
|------|-----|-----|-----|
| **Username** | hk817083_db_user | url_shortener_user | New MongoDB user |
| **Password** | wiIFFppG1q6x8ixt | 9v0kfzYiaomWgA6r | Correct password |
| **Query Params** | None | ?retryWrites=true&w=majority | Better reliability |

---

## Expected Result ✅

After Render redeploys, you should see:

```
✓ Server running on http://localhost:3000
✓ Environment: production
✓ Connected to MongoDB
```

Then your app will be **LIVE**! 🎉

---

## If Error Still Occurs 🔧

### Error: "bad auth : Authentication failed"
- ✅ Check passwords match exactly (no spaces!)
- ✅ Verify username is `url_shortener_user`
- ✅ Check cluster name is `cluster0w`

### Error: "getaddrinfo ENOTFOUND"
- ✅ Go to MongoDB Atlas
- ✅ Click "Network Access"
- ✅ Make sure your IP is whitelisted (0.0.0.0/0)

### Error: "connection refused"
- ✅ Wait 1-2 minutes for Render to redeploy
- ✅ Check Render logs for progress

---

## Test Your Live App 🧪

Once deployed successfully:

1. **Visit your Render URL:**
   ```
   https://url-shortener-xxxxx.onrender.com/
   ```

2. **Try creating a short URL:**
   - Paste: `https://github.com/nodejs/node`
   - Click "Shorten URL"
   - Should see result! ✓

3. **Test the redirect:**
   - Copy the short URL
   - Open in new tab
   - Should redirect to GitHub ✓

4. **Check click count:**
   - Visit: `https://url-shortener-xxxxx.onrender.com/api/urls/[shortCode]/stats`
   - Should show click count increased ✓

---

## MongoDB Atlas Verification ✅

Your credentials are:
- **Username:** `url_shortener_user`
- **Password:** `9v0kfzYiaomWgA6r`
- **Cluster:** `cluster0w`
- **Database:** `url-shortener` (auto-created)
- **Whitelist:** Should allow 0.0.0.0/0 or your Render IP

---

**Action Items:**
1. ✅ Go to Render Dashboard
2. ✅ Update MONGODB_URI environment variable
3. ✅ Click Save Changes
4. ✅ Wait for redeploy (2-3 minutes)
5. ✅ Check logs for success
6. ✅ Test your live app!

Let me know when it's working! 🚀
