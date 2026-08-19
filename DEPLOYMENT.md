# 🚀 PoultryMart Deployment & GitHub Guide

This guide details how to push your **PoultryMart** project to GitHub and deploy it to production (Render / Railway / Vercel).

---

## 1. Pushing to GitHub

Open your terminal in `c:\Farm2Bird`:

```bash
# 1. Add all project files
git add .

# 2. Commit your changes
git commit -m "Deploy: Production-ready PoultryMart Naatu Kollu Marketplace"

# 3. Ensure branch is set to main
git branch -M main

# 4. Push to your GitHub repository
git push -u origin main
```

> **GitHub Repository URL**: [https://github.com/navajeevan122/Poultrymart](https://github.com/navajeevan122/Poultrymart)

---

## 2. Deploying to Production

### Option A: Render.com (Recommended - Free & Easy 1-Click)

1. Sign up at [Render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository `navajeevan122/Poultrymart`.
4. Configure Web Service settings:
   - **Name**: `poultrymart`
   - **Root Directory**: *(Leave empty)*
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Add **Environment Variables** in Render settings:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://TaxGenie:<YOUR_PASSWORD>@cluster0.4lmsmye.mongodb.net/poultrymart?retryWrites=true&w=majority`
   - `JWT_SECRET`: `your_production_secret_key_2026`
6. Click **Create Web Service**. Render will automatically build the React frontend and start the Express backend!

---

### Option B: Decoupled (Vercel Frontend + Render Backend)

#### Deploy Backend to Render:
1. Connect GitHub repo on Render as a Web Service.
2. Set Root Directory to `backend`.
3. Set Build Command: `npm install`
4. Set Start Command: `node server.js`
5. Add `MONGODB_URI` & `JWT_SECRET`. Copy your deployed Render backend URL (e.g., `https://poultrymart-api.onrender.com`).

#### Deploy Frontend to Vercel:
1. Sign up at [Vercel.com](https://vercel.com).
2. Click **Add New** -> **Project** -> Import `Poultrymart`.
3. Set **Framework Preset**: `Vite`.
4. Set **Root Directory**: `frontend`.
5. Add Environment Variable:
   - `VITE_API_URL`: `https://poultrymart-api.onrender.com/api`
6. Click **Deploy**.

---

## 3. Seed Production Database

After your backend server is deployed and connected to MongoDB Atlas, run the seed script to initialize your Admin (`jeevan@poultrymart.com` / `Jeevan1234`) and sample Naatu Kollu listings:

```bash
cd backend
npm run seed
```
