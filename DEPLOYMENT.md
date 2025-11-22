# 🚀 Deployment Guide

## Overview

This application requires **two separate deployments**:
1. **Frontend** (Next.js) → Deploy to **Vercel**
2. **Backend** (Python/FastAPI) → Deploy to **Railway** or **Render**

---

## 📦 Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### 1.2 Deploy Backend
1. Click "New Project" → "Deploy from GitHub repo"
2. Select your `inkle` repository
3. Railway will auto-detect the Python app

### 1.3 Add Environment Variables
In Railway dashboard, go to **Variables** and add:
```
GOOGLE_API_KEY=your_actual_gemini_key
GEOAPIFY_API_KEY=your_actual_geoapify_key
FOURSQUARE_API_KEY=your_actual_foursquare_key
GOOGLE_ROUTES_API_KEY=your_actual_google_routes_key
```

### 1.4 Configure Root Directory
In Railway settings:
- **Root Directory**: `backend`
- **Start Command**: `python -m backend.server`

### 1.5 Get Backend URL
After deployment, Railway will give you a URL like:
```
https://inkle-backend-production.up.railway.app
```
**Copy this URL** - you'll need it for the frontend!

---

## 🎨 Step 2: Deploy Frontend to Vercel

### 2.1 Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Vercel will auto-detect Next.js

### 2.3 Configure Build Settings
Vercel should automatically use the `vercel.json` configuration:
- **Framework**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 2.4 Add Environment Variable
In Vercel dashboard, go to **Settings → Environment Variables** and add:
```
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.up.railway.app
```
Replace with your actual Railway backend URL from Step 1.5!

### 2.5 Deploy
Click "Deploy" and wait for Vercel to build your app.

---

## ✅ Step 3: Verify Deployment

1. Visit your Vercel URL (e.g., `https://inkle.vercel.app`)
2. Try searching for a destination (e.g., "Paris")
3. Check that the map loads and itinerary appears
4. Test the AI chatbot

---

## 🔧 Troubleshooting

### Frontend can't connect to backend
- Check that `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Ensure Railway backend is running (check logs)
- Verify CORS is enabled in `backend/server.py` (it should be)

### Backend errors
- Check Railway logs for errors
- Verify all 4 environment variables are set in Railway
- Ensure API keys are valid

### 404 Error on Vercel
- Make sure `vercel.json` exists in the root directory
- Verify `rootDirectory` is set to `frontend`

---

## 📝 Alternative: Deploy Backend to Render

If you prefer Render over Railway:

1. Go to [render.com](https://render.com)
2. Create a new **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m backend.server`
5. Add the same 4 environment variables
6. Copy the Render URL and use it in Vercel's `NEXT_PUBLIC_API_URL`

---

## 🎉 Done!

Your app is now live! Share your Vercel URL with others.

**Example URLs:**
- Frontend: `https://inkle-yourname.vercel.app`
- Backend: `https://inkle-backend.up.railway.app`
