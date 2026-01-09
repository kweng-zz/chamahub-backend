# ChamaHub Backend - Production Deployment Guide

This document provides step-by-step instructions for deploying the ChamaHub backend to Render.

## Quick Start

1. **Read the full guide**: `RENDER_DEPLOYMENT.md`
2. **Review the checklist**: `PRODUCTION_CHECKLIST.md`
3. **Follow the steps below**

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Frontend                          │
│              (chamahub.vercel.app)                          │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Render Web Service                         │
│            (chamahub-backend.onrender.com)                  │
│                  NestJS Application                         │
└────────────────────────┬────────────────────────────────────┘
                         │ Internal Connection
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Render PostgreSQL Database                     │
│                  (chamahub-db)                              │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

Before you start, ensure you have:

- [ ] Render account (https://render.com)
- [ ] GitHub account with your code pushed
- [ ] Vercel frontend deployed
- [ ] Production Clerk keys
- [ ] Production M-Pesa credentials (if using payments)
- [ ] All environment variables documented

## Deployment Steps

### Step 1: Prepare Your Code

```bash
# Ensure all code is committed and pushed to GitHub
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **PostgreSQL**
3. Fill in:
   - **Name**: `chamahub-db`
   - **Database**: `chamahub`
   - **User**: `postgres`
   - **Region**: Choose your region
   - **PostgreSQL Version**: 15+
4. Click **Create Database**
5. Wait for creation (2-3 minutes)
6. **Copy the Internal Database URL** - you'll need this next

### Step 3: Create Web Service on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Select your GitHub repository
4. Configure:
   - **Name**: `chamahub-backend`
   - **Environment**: `Node`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: Starter (recommended for production)
5. Click **Create Web Service**

### Step 4: Configure Environment Variables

In your Render web service dashboard:

1. Go to **Environment** tab
2. Add these variables:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=<paste your Internal Database URL>
CLERK_SECRET_KEY=<your production secret key>
CLERK_PUBLISHABLE_KEY=<your production publishable key>
CORS_ORIGINS=https://your-frontend.vercel.app,https://www.your-frontend.vercel.app
MPESA_ENVIRONMENT=production
MPESA_CONSUMER_KEY=<production key>
MPESA_CONSUMER_SECRET=<production secret>
MPESA_PASSKEY=<production passkey>
MPESA_SHORTCODE=<production shortcode>
MPESA_INITIATOR_NAME=<initiator name>
MPESA_SECURITY_CREDENTIAL=<production credential>
MPESA_CALLBACK_URL=https://chamahub-backend.onrender.com/api/v1/mpesa/callback
FRONTEND_URL=https://your-frontend.vercel.app
DB_LOGGING=false
DB_SSL=true
```

**Important**: Replace placeholder values with your actual production values.

### Step 5: Deploy and Run Migrations

1. Render will automatically start building and deploying
2. Monitor the **Logs** tab for build progress
3. Once deployed, click **Shell** tab
4. Run migrations:
   ```bash
   npm run migration:run:prod
   ```
5. Verify success in the logs

### Step 6: Verify Deployment

Test your backend:

```bash
# Health check
curl https://chamahub-backend.onrender.com/api/v1/health

# Should return:
# {"status":"ok","timestamp":"2024-01-15T10:30:00.000Z"}
```

### Step 7: Update Frontend

Update your frontend to use the production backend URL:

In your frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=https://chamahub-backend.onrender.com
```

Redeploy your frontend on Vercel.

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://...` |
| `CLERK_SECRET_KEY` | Clerk authentication | `sk_live_...` |
| `CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_live_...` |
| `CORS_ORIGINS` | Allowed frontend URLs | `https://app.vercel.app` |
| `MPESA_ENVIRONMENT` | M-Pesa mode | `production` |
| `MPESA_CONSUMER_KEY` | M-Pesa API key | `your_key` |
| `MPESA_CONSUMER_SECRET` | M-Pesa API secret | `your_secret` |
| `MPESA_PASSKEY` | M-Pesa passkey | `your_passkey` |
| `MPESA_SHORTCODE` | M-Pesa shortcode | `174379` |
| `MPESA_INITIATOR_NAME` | M-Pesa initiator | `testapi` |
| `MPESA_SECURITY_CREDENTIAL` | M-Pesa credential | `your_credential` |
| `MPESA_CALLBACK_URL` | M-Pesa callback URL | `https://backend.onrender.com/api/v1/mpesa/callback` |
| `FRONTEND_URL` | Frontend URL | `https://app.vercel.app` |
| `DB_LOGGING` | Database query logging | `false` |
| `DB_SSL` | Database SSL | `true` |

## Monitoring & Maintenance

### View Logs
- Go to your service dashboard
- Click **Logs** tab
- Real-time logs appear here

### Monitor Performance
- Click **Metrics** tab
- View CPU, memory, and request metrics

### Restart Service
- Click **Settings** tab
- Click **Restart** button

### View Deployments
- Click **Deployments** tab
- See deployment history
- Rollback to previous versions if needed

## Troubleshooting

### Build Fails
**Error**: `npm ERR! code ERESOLVE`
- Solution: Update `package-lock.json` locally and push

**Error**: `Cannot find module`
- Solution: Ensure all dependencies are in `package.json`

### Application Won't Start
**Error**: `Cannot connect to database`
- Solution: Verify `DATABASE_URL` is correct in environment variables
- Check PostgreSQL service is running

**Error**: `Port already in use`
- Solution: Ensure `PORT` is set to 3000

### Database Issues
**Error**: `relation does not exist`
- Solution: Run migrations: `npm run migration:run:prod`

**Error**: `permission denied`
- Solution: Check database user permissions

### CORS Errors
**Error**: `Access to XMLHttpRequest blocked by CORS`
- Solution: Add your frontend URL to `CORS_ORIGINS`
- Include both `https://` and `https://www.` variants

## Scaling Considerations

### Free Tier
- Limited resources
- Spins down after 15 minutes of inactivity
- Good for development/testing

### Starter Plan ($7/month)
- Always running
- Better performance
- Recommended for production

### Pro Plan ($25/month)
- Higher resource limits
- Priority support
- For high-traffic applications

## Security Best Practices

1. **Never commit `.env` files** - Use `.gitignore`
2. **Use production credentials** - Not test/sandbox keys
3. **Enable database SSL** - Set `DB_SSL=true`
4. **Restrict CORS** - Only allow your frontend domain
5. **Rotate secrets regularly** - Update API keys periodically
6. **Monitor logs** - Watch for suspicious activity
7. **Use strong passwords** - For database and API keys

## Backup & Recovery

### Database Backups
- Render provides automatic backups
- Access via Render dashboard
- Download backups if needed

### Rollback Procedure
1. Go to **Deployments** tab
2. Find previous successful deployment
3. Click **Redeploy**
4. Monitor logs to confirm

## Performance Optimization

1. **Enable caching** - Consider Redis for session storage
2. **Optimize queries** - Use database indexes
3. **Compress responses** - Enable gzip compression
4. **Monitor metrics** - Watch CPU and memory usage
5. **Scale horizontally** - Add more instances if needed

## Support & Resources

- [Render Documentation](https://render.com/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Clerk Documentation](https://clerk.com/docs)
- [M-Pesa Documentation](https://developer.safaricom.co.ke)

## Next Steps

1. ✅ Complete the deployment steps above
2. ✅ Run the production checklist
3. ✅ Test all endpoints thoroughly
4. ✅ Monitor logs for errors
5. ✅ Set up alerts (optional)
6. ✅ Document your deployment

## Support

If you encounter issues:

1. Check the **Logs** tab in Render dashboard
2. Review this guide's troubleshooting section
3. Check Render's status page
4. Contact Render support if needed

---

**Last Updated**: January 2024
**Backend Version**: 1.0.0
**Deployment Platform**: Render
