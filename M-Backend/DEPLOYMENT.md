# Deployment Guide - DJ Party Mode Backend

## Overview

This guide covers deploying the DJ Party Mode backend to various platforms.

## Prerequisites

- MongoDB database (MongoDB Atlas recommended for production)
- Git repository
- Environment variables configured

## Option 1: Deploy to Heroku

### Step 1: Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Or download from https://devcenter.heroku.com/articles/heroku-cli
```

### Step 2: Login and Create App
```bash
heroku login
heroku create dj-party-mode-backend
```

### Step 3: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret-key
heroku config:set MONGODB_URI=your-mongodb-atlas-connection-string
heroku config:set CLIENT_URL=https://your-frontend-url.com
```

### Step 4: Deploy
```bash
git push heroku main
```

### Step 5: Open App
```bash
heroku open
heroku logs --tail
```

## Option 2: Deploy to Railway

### Step 1: Install Railway CLI
```bash
npm i -g @railway/cli
```

### Step 2: Login and Initialize
```bash
railway login
railway init
```

### Step 3: Set Environment Variables
Go to Railway dashboard → Your Project → Variables, and add:
- `NODE_ENV=production`
- `JWT_SECRET=your-secret-key`
- `MONGODB_URI=your-mongodb-uri`
- `CLIENT_URL=your-frontend-url`
- `PORT` (Railway sets this automatically)

### Step 4: Deploy
```bash
railway up
```

Or connect your GitHub repository in the Railway dashboard for automatic deployments.

## Option 3: Deploy to Render

### Step 1: Create Account
Sign up at https://render.com

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: dj-party-mode-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Set Environment Variables
Add in Render dashboard:
- `NODE_ENV=production`
- `JWT_SECRET=your-secret-key`
- `MONGODB_URI=your-mongodb-uri`
- `CLIENT_URL=your-frontend-url`

### Step 4: Deploy
Render will automatically deploy on git push.

## Option 4: Deploy to DigitalOcean App Platform

### Step 1: Create Account
Sign up at https://www.digitalocean.com

### Step 2: Create New App
1. Go to Apps → Create App
2. Connect GitHub repository
3. Configure:
   - **Resource Type**: Web Service
   - **Environment Variables**: Add all required variables
   - **HTTP Port**: 5000

### Step 3: Deploy
DigitalOcean will build and deploy automatically.

## Option 5: Deploy to AWS EC2 (Advanced)

### Step 1: Launch EC2 Instance
- Ubuntu Server 20.04 LTS
- t2.micro (free tier eligible)
- Configure security group (ports 22, 80, 443, 5000)

### Step 2: Connect and Setup
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB (or use Atlas)
# Install PM2
sudo npm install -g pm2

# Clone repository
git clone your-repo-url
cd M-Backend
npm install
```

### Step 3: Configure Environment
```bash
nano .env
# Add production environment variables
```

### Step 4: Start with PM2
```bash
pm2 start src/server.js --name dj-party-backend
pm2 startup
pm2 save
```

### Step 5: Setup Nginx (Optional)
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

## MongoDB Atlas Setup (Recommended for Production)

### Step 1: Create Cluster
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Choose cloud provider and region

### Step 2: Configure Network Access
1. Go to Network Access
2. Add IP Address: `0.0.0.0/0` (or specific IPs)

### Step 3: Create Database User
1. Go to Database Access
2. Add New Database User
3. Save username and password

### Step 4: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` and `<dbname>`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dj-party-mode?retryWrites=true&w=majority
```

## Environment Variables Reference

### Required for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-random-secret>
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend.com
```

### Optional
```env
ROOM_CODE_LENGTH=6
SKIP_THRESHOLD_PERCENTAGE=50
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
```

## Post-Deployment Checklist

- [ ] Server is accessible via HTTPS
- [ ] MongoDB connection is working
- [ ] Environment variables are set correctly
- [ ] CORS is configured for frontend URL
- [ ] JWT_SECRET is strong and unique
- [ ] Health check endpoint works
- [ ] Socket.io connections work
- [ ] API endpoints are responding
- [ ] Logs are monitored
- [ ] Backups are configured (for database)

## Monitoring and Logging

### Using PM2 (for EC2)
```bash
pm2 logs dj-party-backend
pm2 monit
pm2 status
```

### Using Heroku
```bash
heroku logs --tail
```

### Using Railway/Render
Check logs in the dashboard.

## SSL/HTTPS Setup

Most platforms (Heroku, Railway, Render) provide SSL automatically.

For custom deployments:
- Use Let's Encrypt with Certbot
- Configure Nginx with SSL certificates
- Update CLIENT_URL to use https://

## Scaling Considerations

### Horizontal Scaling
- Use Redis for session management
- Implement Socket.io Redis adapter
- Use load balancer

### Database Optimization
- Add indexes (already configured in models)
- Use MongoDB connection pooling
- Implement caching with Redis

### Performance Monitoring
- Use New Relic or DataDog
- Monitor API response times
- Track Socket.io connections
- Set up error tracking (Sentry)

## Backup Strategy

### Database Backups
- MongoDB Atlas: Automatic backups enabled
- Self-hosted: Use mongodump
  ```bash
  mongodump --uri="mongodb://localhost:27017/dj-party-mode" --out=/backup
  ```

### Code Backups
- Keep Git repository updated
- Tag releases: `git tag v1.0.0`
- Use GitHub/GitLab for version control

## Security Best Practices

1. **Never commit .env files**
2. **Use strong JWT secrets** (32+ characters)
3. **Enable rate limiting** (add express-rate-limit)
4. **Keep dependencies updated** (`npm audit fix`)
5. **Use HTTPS only** in production
6. **Validate all inputs** (already implemented)
7. **Monitor for security issues**

## Troubleshooting

### Server won't start
- Check logs: `heroku logs --tail` or `pm2 logs`
- Verify environment variables
- Check MongoDB connection

### Socket.io not connecting
- Verify CORS configuration
- Check firewall rules
- Ensure WebSocket support

### Database connection failed
- Verify MONGODB_URI
- Check IP whitelist on Atlas
- Verify database user credentials

## Rolling Back

### Heroku
```bash
heroku releases
heroku rollback v123
```

### Railway/Render
Use dashboard to rollback to previous deployment.

### Manual
```bash
git revert <commit-hash>
git push
```

## Support

For deployment issues:
1. Check platform-specific documentation
2. Review error logs
3. Verify environment configuration
4. Open issue on GitHub

---

**Good luck with your deployment! 🚀**
