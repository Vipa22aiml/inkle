# 🚀 Deployment Guide - Inkle

This guide will walk you through deploying your AI-powered travel planner to production.

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- [ ] GitHub account with your code pushed to a repository
- [ ] All 4 API keys ready:
  - Google Gemini API Key
  - Geoapify API Key
  - Foursquare API Key
  - Google Routes API Key
- [ ] Railway account (or Render as alternative)
- [ ] Vercel account

---

## 🏗️ Architecture Overview

Your app needs **two separate deployments**:

```
┌─────────────────────────────────────────┐
│   Frontend (Next.js)                    │
│   Platform: Vercel                      │
│   URL: https://inkle.vercel.app         │
└──────────────┬──────────────────────────┘
               │
               │ API Calls
               ▼
┌─────────────────────────────────────────┐
│   Backend (Python/FastAPI)              │
│   Platform: Railway                     │
│   URL: https://inkle.up.railway.app     │
└─────────────────────────────────────────┘
```

---

## 🚂 Part 1: Deploy Backend to Railway

### Step 1: Push Your Code to GitHub

First, make sure your code is on GitHub:

```bash
# If you haven't already created a GitHub repo:
# 1. Go to https://github.com/new
# 2. Create a new repository called "inkle" (make it PUBLIC)
# 3. Then run:

git remote add origin https://github.com/YOUR_USERNAME/inkle.git
git branch -M main
git push -u origin main
```

### Step 2: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway to access your GitHub

### Step 3: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your **`inkle`** repository
4. Railway will automatically detect it's a Python project

### Step 4: Configure Backend Service

Railway should auto-detect the backend, but let's configure it properly:

1. Click on your deployed service
2. Go to **Settings** tab
3. Set **Root Directory**: `backend`
4. Go to **Deploy** tab
5. Set **Start Command**: `uvicorn backend.server:app --host 0.0.0.0 --port $PORT`

### Step 5: Add Environment Variables

1. Go to **Variables** tab
2. Click **"+ New Variable"**
3. Add these **4 environment variables**:

```env
GOOGLE_API_KEY=your_actual_gemini_api_key_here
GEOAPIFY_API_KEY=your_actual_geoapify_api_key_here
FOURSQUARE_API_KEY=your_actual_foursquare_api_key_here
GOOGLE_ROUTES_API_KEY=your_actual_google_routes_api_key_here
```

> ⚠️ **IMPORTANT**: Use your **real API keys**, not placeholder text!

### Step 6: Generate Domain

1. Go to **Settings** tab
2. Scroll to **Networking** section
3. Click **"Generate Domain"**
4. You'll get a URL like: `https://inkle-production-xxxx.up.railway.app`

**📋 COPY THIS URL** - you'll need it for Vercel!

### Step 7: Verify Backend is Running

1. Go to **Deployments** tab
2. Wait for deployment to complete (green checkmark)
3. Click **"View Logs"** to check for errors
4. Test your backend by visiting: `https://your-railway-url.up.railway.app/health`

You should see: `{"status": "healthy"}`

---

## ▲ Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub

### Step 2: Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find and select your **`inkle`** repository
3. Click **"Import"**

### Step 3: Configure Build Settings

Vercel should automatically detect the `vercel.json` configuration. Verify:

- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)

### Step 4: Add Environment Variable

This is **CRITICAL** - your frontend needs to know where the backend is!

1. Before clicking "Deploy", expand **"Environment Variables"**
2. Add a new variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-railway-backend-url.up.railway.app` (from Part 1, Step 6)
3. Make sure it's enabled for **Production**, **Preview**, and **Development**

### Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for Vercel to build your app
3. You'll get a URL like: `https://inkle-xxxx.vercel.app`

### Step 6: Verify Deployment

1. Visit your Vercel URL
2. Try searching for **"Paris"** or **"Tokyo"**
3. Check that:
   - ✅ Map loads with markers
   - ✅ Itinerary cards appear
   - ✅ Weather data shows
   - ✅ Chatbot button works

---

## ✅ Post-Deployment Checklist

- [ ] Backend is running on Railway (check logs)
- [ ] Frontend is deployed on Vercel
- [ ] Environment variable `NEXT_PUBLIC_API_URL` is set correctly
- [ ] All 4 API keys are configured in Railway
- [ ] Test search works end-to-end
- [ ] Map displays correctly
- [ ] Chatbot responds

---

## 🔧 Troubleshooting

### ❌ "Failed to fetch" error on frontend

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Check that `NEXT_PUBLIC_API_URL` is set in Vercel
2. Verify Railway backend is running (check deployment logs)
3. Make sure Railway domain is generated
4. Check CORS is enabled in `backend/server.py` (it should be)

### ❌ Backend crashes on Railway

**Problem**: Backend fails to start

**Solutions**:
1. Check Railway logs for error messages
2. Verify all 4 environment variables are set
3. Ensure API keys are valid (test them locally first)
4. Check that `requirements.txt` includes all dependencies

### ❌ 404 Error on Vercel

**Problem**: Vercel can't find the app

**Solutions**:
1. Verify `vercel.json` exists in root directory
2. Check that `rootDirectory` is set to `frontend` in `vercel.json`
3. Ensure `frontend/package.json` exists

### ❌ Map doesn't load

**Problem**: Leaflet map not rendering

**Solutions**:
1. Check browser console for errors
2. Verify Geoapify API key is valid
3. Clear browser cache and reload

---

## 🔄 Updating Your Deployment

When you make changes to your code:

```bash
# Commit and push changes
git add .
git commit -m "Your update message"
git push origin main
```

- **Railway**: Auto-deploys on every push to `main`
- **Vercel**: Auto-deploys on every push to `main`

Both platforms will automatically rebuild and redeploy! 🎉

---

## 🌐 Alternative: Deploy Backend to Render

If you prefer **Render** over Railway:

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `inkle-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.server:app --host 0.0.0.0 --port $PORT`

### Step 3: Add Environment Variables
Add the same 4 API keys as environment variables

### Step 4: Deploy
Click **"Create Web Service"** and wait for deployment

### Step 5: Get URL
Copy the Render URL (e.g., `https://inkle-backend.onrender.com`)

### Step 6: Update Vercel
Go to Vercel → Settings → Environment Variables → Update `NEXT_PUBLIC_API_URL` with your Render URL

---

## 🎉 You're Live!

Your AI travel planner is now deployed and accessible worldwide!

**Share your URLs:**
- 🌐 Frontend: `https://inkle-yourname.vercel.app`
- 🔧 Backend: `https://inkle-production.up.railway.app`

**Next Steps:**
- Share with friends and get feedback
- Monitor Railway/Vercel logs for errors
- Consider adding analytics (Vercel Analytics, Google Analytics)
- Set up custom domain (optional)

---

## 📊 Monitoring & Logs

### Railway Logs
- Go to your Railway project
- Click on the service
- Click **"Deployments"** → **"View Logs"**

### Vercel Logs
- Go to your Vercel project
- Click **"Deployments"**
- Click on a deployment → **"View Function Logs"**

---

## 💰 Cost Estimate

Both platforms offer generous free tiers:

| Platform | Free Tier | Cost After Free Tier |
|----------|-----------|---------------------|
| **Railway** | $5 credit/month | ~$5-10/month for hobby projects |
| **Vercel** | 100GB bandwidth | ~$20/month for Pro (if needed) |
| **Render** | 750 hours/month | Free for hobby projects |

For a personal project, you should stay within free tiers! 🎉
