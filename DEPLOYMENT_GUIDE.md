# Vercel Deployment Guide

## Problem Analysis: DEPLOYMENT_NOT_FOUND Error

### Root Causes Identified:

1. **Incorrect vercel.json Configuration**
   - The `vercel.json` in backend folder pointed to `index.js` instead of `src/index.js`
   - No root-level configuration for monorepo structure
   - Missing proper routing configuration

2. **Hardcoded Localhost URLs**
   - Frontend had hardcoded `http://localhost:3000` API URLs
   - No environment-based API configuration
   - Would break in production

3. **Monorepo Structure Mismatch**
   - Vercel needs explicit configuration for monorepo deployments
   - Separate frontend/backend folders require proper routing

4. **Missing Environment Variables**
   - No `.env.example` or documentation for required variables
   - CORS configuration not set for production

## Solution Implemented

### 1. Root-Level vercel.json
Created a root `vercel.json` that:
- Routes `/api/*` requests to backend
- Serves frontend static files for all other routes
- Configures builds for both frontend and backend

### 2. Dynamic API Configuration
Created `frontend/src/config/api.js` that:
- Uses environment variables in production
- Falls back to localhost in development
- Automatically detects Vercel deployment URLs

### 3. Updated Backend for Serverless
Modified `backend/src/index.js` to:
- Work as both standalone server (dev) and serverless function (Vercel)
- Handle CORS properly for production
- Connect to database only when needed

## Deployment Steps

### Option 1: Deploy as Monorepo (Recommended)

1. **Link Project to Vercel:**
   ```bash
   cd "D:\assignment\Coupon Management"
   vercel link
   ```

2. **Set Environment Variables in Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add:
     - `MONGODB_URI` - Your MongoDB connection string
     - `CORS_ORIGIN` - Your frontend URL (or `*` for all)
     - `VITE_API_URL` - Your API URL (e.g., `https://your-project.vercel.app/api`)

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy Frontend and Backend Separately

#### Deploy Backend:
```bash
cd backend
vercel --prod
```
Note the backend URL (e.g., `https://backend-project.vercel.app`)

#### Deploy Frontend:
```bash
cd frontend
vercel --prod
```
Set environment variable:
- `VITE_API_URL=https://backend-project.vercel.app`

## Environment Variables Required

### Backend (.env):
```
MONGODB_URI=mongodb+srv://...
CORS_ORIGIN=https://your-frontend.vercel.app
PORT=3000
```

### Frontend (.env):
```
VITE_API_URL=https://your-backend.vercel.app/api
```

## Testing Deployment

1. **Check Backend Health:**
   ```
   https://your-project.vercel.app/api/health
   ```

2. **Check API Root:**
   ```
   https://your-project.vercel.app/api/
   ```

3. **Test Frontend:**
   ```
   https://your-project.vercel.app
   ```

## Troubleshooting

### If DEPLOYMENT_NOT_FOUND persists:

1. **Check vercel.json location:**
   - Should be at root level for monorepo
   - Or in respective folders for separate deployments

2. **Verify build settings:**
   - Frontend: Build command `npm run build`
   - Backend: No build needed (serverless)

3. **Check file paths:**
   - Backend entry: `backend/src/index.js`
   - Frontend output: `frontend/dist`

4. **Verify environment variables:**
   - All required variables set in Vercel dashboard
   - Variables prefixed correctly (`VITE_` for frontend)

## Alternative: Use Vercel CLI

If dashboard deployment fails:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set production environment variables
vercel env add MONGODB_URI
vercel env add CORS_ORIGIN
vercel env add VITE_API_URL

# Deploy to production
vercel --prod
```

