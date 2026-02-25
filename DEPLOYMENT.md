# Deployment Guide - Mini Online Learning Portal

## Overview

This guide covers deploying the Mini Online Learning Portal to various cloud platforms using Supabase as the database.

---

## Prerequisites

✅ Supabase project created and configured (see [SUPABASE_SETUP.md](file:///d:/Website/SUPABASE_SETUP.md))
✅ Database schema and seed data loaded
✅ Application tested locally
✅ Node.js installed

---

## Option 1: Deploy to Vercel (Recommended)

**Best for:** Quick deployment, automatic HTTPS, serverless functions

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
cd d:\Website
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **What's your project's name?** → `mini-learning-portal`
- **In which directory is your code located?** → `./`
- **Want to override settings?** → No

### Step 4: Add Environment Variables

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:

```
DB_HOST = db.xxxxx.supabase.co
DB_PORT = 5432
DB_NAME = postgres
DB_USER = postgres
DB_PASSWORD = your_database_password
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_ANON_KEY = your_anon_key
SUPABASE_SERVICE_KEY = your_service_role_key
NODE_ENV = production
PORT = 3000
SESSION_SECRET = generate_random_secret_here
ENABLE_SECURITY_LOGGING = true
LOG_LEVEL = info
```

**Option B: Via CLI**

```bash
vercel env add DB_HOST
# Enter value: db.xxxxx.supabase.co
# Select environments: Production, Preview, Development

# Repeat for each variable
```

### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

### Step 6: Access Your Site

Your site will be live at: `https://mini-learning-portal.vercel.app`

---

## Option 2: Deploy to Netlify

**Best for:** Static sites with serverless functions, form handling

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

### Step 3: Initialize

```bash
cd d:\Website
netlify init
```

Follow the prompts:
- **Create & configure a new site** → Yes
- **Team** → Select your team
- **Site name** → `mini-learning-portal`
- **Build command** → `npm install`
- **Directory to deploy** → `public`

### Step 4: Add Environment Variables

```bash
netlify env:set DB_HOST "db.xxxxx.supabase.co"
netlify env:set DB_PORT "5432"
netlify env:set DB_NAME "postgres"
netlify env:set DB_USER "postgres"
netlify env:set DB_PASSWORD "your_password"
netlify env:set SUPABASE_URL "https://xxxxx.supabase.co"
netlify env:set SUPABASE_ANON_KEY "your_anon_key"
netlify env:set SUPABASE_SERVICE_KEY "your_service_key"
netlify env:set NODE_ENV "production"
netlify env:set SESSION_SECRET "random_secret"
netlify env:set ENABLE_SECURITY_LOGGING "true"
```

### Step 5: Deploy

```bash
netlify deploy --prod
```

### Step 6: Access Your Site

Your site will be live at: `https://mini-learning-portal.netlify.app`

---

## Option 3: Deploy to Railway

**Best for:** Full-stack apps, databases, persistent storage

### Step 1: Create Railway Account

Go to https://railway.app and sign up

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"** (or "Empty Project")
3. If using GitHub:
   - Connect your GitHub account
   - Select your repository
4. If using Empty Project:
   - Click **"Empty Project"**
   - Then **"GitHub Repo"** → Connect repository

### Step 3: Add Environment Variables

1. Click on your project
2. Go to **Variables** tab
3. Click **"New Variable"**
4. Add all variables from your `.env` file

### Step 4: Configure Build

Railway auto-detects Node.js projects. If needed, configure:

1. Go to **Settings** tab
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`

### Step 5: Deploy

Railway automatically deploys on push to main branch.

### Step 6: Access Your Site

Your site will be live at: `https://mini-learning-portal.up.railway.app`

---

## Option 4: Deploy to Render

**Best for:** Free tier, automatic SSL, custom domains

### Step 1: Create Render Account

Go to https://render.com and sign up

### Step 2: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `mini-learning-portal`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Add Environment Variables

In the **Environment** section, add:

```
DB_HOST = db.xxxxx.supabase.co
DB_PORT = 5432
DB_NAME = postgres
DB_USER = postgres
DB_PASSWORD = your_password
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_ANON_KEY = your_anon_key
SUPABASE_SERVICE_KEY = your_service_key
NODE_ENV = production
SESSION_SECRET = random_secret
ENABLE_SECURITY_LOGGING = true
LOG_LEVEL = info
```

### Step 4: Deploy

Click **"Create Web Service"**

### Step 5: Access Your Site

Your site will be live at: `https://mini-learning-portal.onrender.com`

---

## Option 5: Deploy to AWS EC2 (Traditional)

**Best for:** Full control, custom configurations, enterprise deployments

### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2
2. Click **"Launch Instance"**
3. Configure:
   - **Name**: `mini-learning-portal`
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance Type**: t3.medium (or t2.micro for testing)
   - **Key Pair**: Create or select existing
   - **Security Group**: Allow ports 22, 80, 443

### Step 2: Connect to Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

### Step 4: Clone and Setup Application

```bash
# Create app directory
sudo mkdir -p /var/www/learning-portal
sudo chown ubuntu:ubuntu /var/www/learning-portal
cd /var/www/learning-portal

# Copy your files (use SCP, Git, or other method)
# For example, using Git:
git clone your-repo-url .

# Install dependencies
npm install
```

### Step 5: Configure Environment

```bash
# Create .env file
nano .env

# Add your Supabase credentials
# (paste your environment variables)

# Save and exit (Ctrl+X, Y, Enter)
```

### Step 6: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/learning-portal
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # or your EC2 IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/learning-portal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Start Application with PM2

```bash
cd /var/www/learning-portal
pm2 start server.js --name learning-portal
pm2 save
pm2 startup
```

### Step 8: Configure SSL (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

### Step 9: Access Your Site

Your site will be live at: `http://your-ec2-ip` or `https://your-domain.com`

---

## Post-Deployment Checklist

After deploying to any platform:

### 1. Test Core Functionality

- ✅ Homepage loads
- ✅ Registration works
- ✅ Login works (student1 / password123)
- ✅ Courses display
- ✅ Search works
- ✅ Enrollment works
- ✅ Comments work
- ✅ Admin login works (admin / admin123)
- ✅ Admin dashboard displays

### 2. Verify Database Connection

Check Supabase Dashboard → Database → security_logs table for new entries

### 3. Test Security Logging

Make a few requests and verify they appear in security_logs

### 4. Run Attack Simulations

Update attack simulation scripts with your deployed URL:

```javascript
// In attack-simulations/*.js
const TARGET_URL = 'https://your-deployed-url.com';
```

Then run:
```bash
node attack-simulations/ddos.js
node attack-simulations/bruteforce.js
node attack-simulations/sqli.js
```

### 5. Monitor Logs

- **Vercel**: Dashboard → Logs
- **Netlify**: Site → Functions → Logs
- **Railway**: Project → Deployments → Logs
- **Render**: Dashboard → Logs
- **AWS EC2**: `pm2 logs learning-portal`

### 6. Set Up Custom Domain (Optional)

Most platforms support custom domains:
- Add your domain in platform settings
- Update DNS records (A or CNAME)
- Configure SSL

---

## Security Considerations for Production

⚠️ **IMPORTANT REMINDERS:**

### 1. Environment Variables

- ✅ Never commit `.env` to Git
- ✅ Use platform environment variables
- ✅ Keep `SUPABASE_SERVICE_KEY` secret
- ✅ Generate strong `SESSION_SECRET`

### 2. Intentional Vulnerabilities

This application has **intentional security flaws** for testing:

- ⚠️ SQL Injection in search
- ⚠️ XSS in comments
- ⚠️ No rate limiting
- ⚠️ Weak authentication

**Do NOT expose to public internet without:**
- Firewall rules
- IP whitelisting
- Additional security layers
- Clear warnings to users

### 3. Database Security

In Supabase Dashboard:
- Enable Row Level Security (RLS) if needed
- Review connection pooling settings
- Monitor query performance
- Set up backups

### 4. Monitoring

Set up monitoring for:
- Uptime (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Performance (New Relic, Datadog)
- Security logs (review regularly)

---

## Troubleshooting

### Application Won't Start

```bash
# Check logs
vercel logs  # Vercel
netlify logs  # Netlify
pm2 logs learning-portal  # PM2

# Common issues:
# - Missing environment variables
# - Database connection failed
# - Port already in use
```

### Database Connection Errors

```bash
# Test connection
node -e "require('./database/db').query('SELECT NOW()').then(r => console.log(r.rows))"

# Check:
# - DB_HOST is correct
# - DB_PASSWORD is correct
# - Supabase project is active
# - SSL is enabled
```

### 502 Bad Gateway (Nginx)

```bash
# Check if app is running
pm2 status

# Check Nginx config
sudo nginx -t

# Restart services
pm2 restart learning-portal
sudo systemctl restart nginx
```

---

## Cost Estimates

### Free Tier Options

| Platform | Free Tier | Limits |
|----------|-----------|--------|
| **Supabase** | Yes | 500MB DB, 1GB storage, 2GB bandwidth |
| **Vercel** | Yes | 100GB bandwidth, serverless functions |
| **Netlify** | Yes | 100GB bandwidth, 300 build minutes |
| **Railway** | $5 credit | ~500 hours/month |
| **Render** | Yes | 750 hours/month, sleeps after inactivity |

### Paid Options

- **Vercel Pro**: $20/month
- **Netlify Pro**: $19/month
- **Railway**: Pay-as-you-go (~$5-20/month)
- **Render**: $7/month (no sleep)
- **AWS EC2 t3.medium**: ~$30/month

---

## Scaling Considerations

For production use:

1. **Database**: Upgrade Supabase plan for more connections
2. **Caching**: Add Redis for session storage
3. **CDN**: Use Cloudflare for static assets
4. **Load Balancer**: For multiple instances
5. **Auto-scaling**: Configure based on traffic

---

## Summary

**Recommended for Testing:**
- ✅ Vercel (easiest, fastest)
- ✅ Supabase Free Tier (sufficient for testing)

**Recommended for Production:**
- ✅ Railway or Render (good balance)
- ✅ AWS EC2 (full control)
- ✅ Supabase Pro (better performance)

Your Mini Learning Portal is now ready for cloud deployment! 🚀
