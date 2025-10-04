# Eromify Production Deployment

## Files Structure
- `frontend/` - Built React application
- `backend/` - Node.js backend with dependencies

## Deployment Instructions

### Vercel (Recommended)
```bash
# Deploy frontend
cd frontend
vercel --prod

# Deploy backend
cd ../backend
vercel --prod
```

### Netlify
```bash
# Deploy frontend
netlify deploy --prod --dir=frontend

# Deploy backend separately
# Use your preferred Node.js hosting service
```

### Manual Server
```bash
# Upload files to your server
# Install PM2 for process management
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name "eromify-backend"

# Serve frontend with nginx or similar
```

## Environment Variables
Make sure to update the environment variables in both frontend and backend with your actual values:
- Supabase credentials
- OpenAI API key
- JWT secret
- Domain URLs
