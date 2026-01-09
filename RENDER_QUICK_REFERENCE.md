# ChamaHub Backend - Render Deployment Quick Reference

## 🚀 Quick Start (5 minutes)

### 1. Create Database
```
Render Dashboard → New + → PostgreSQL
Name: chamahub-db
Database: chamahub
Copy: Internal Database URL
```

### 2. Create Web Service
```
Render Dashboard → New + → Web Service
Connect GitHub repository
Build: npm ci && npm run build
Start: npm run start:prod
```

### 3. Add Environment Variables
```
NODE_ENV=production
PORT=3000
DATABASE_URL=<from step 1>
CLERK_SECRET_KEY=<your production key>
CLERK_PUBLISHABLE_KEY=<your production key>
CORS_ORIGINS=https://your-frontend.vercel.app
MPESA_ENVIRONMENT=production
MPESA_CONSUMER_KEY=<production key>
MPESA_CONSUMER_SECRET=<production secret>
MPESA_PASSKEY=<production passkey>
MPESA_SHORTCODE=<production shortcode>
MPESA_INITIATOR_NAME=<initiator>
MPESA_SECURITY_CREDENTIAL=<credential>
MPESA_CALLBACK_URL=https://chamahub-backend.onrender.com/api/v1/mpesa/callback
FRONTEND_URL=https://your-frontend.vercel.app
DB_LOGGING=false
DB_SSL=true
```

### 4. Run Migrations
```
Render Dashboard → Shell
npm run migration:run:prod
```

### 5. Test
```
curl https://chamahub-backend.onrender.com/api/v1/health
```

## 📋 Checklist

- [ ] Code pushed to GitHub
- [ ] PostgreSQL database created
- [ ] Web service created
- [ ] All environment variables set
- [ ] Migrations run successfully
- [ ] Health endpoint responds
- [ ] Frontend updated with backend URL
- [ ] CORS working
- [ ] Authentication working
- [ ] Database queries working

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Render Dashboard | https://dashboard.render.com |
| Your Backend | https://chamahub-backend.onrender.com |
| Your Frontend | https://your-frontend.vercel.app |
| Health Check | https://chamahub-backend.onrender.com/api/v1/health |

## 🛠️ Common Commands

```bash
# View logs
Render Dashboard → Logs tab

# Run migrations
npm run migration:run:prod

# Restart service
Render Dashboard → Settings → Restart

# Rollback deployment
Render Dashboard → Deployments → Redeploy previous

# SSH into service
Render Dashboard → Shell tab
```

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check logs, verify dependencies |
| Can't connect to DB | Verify DATABASE_URL, check PostgreSQL running |
| CORS errors | Add frontend URL to CORS_ORIGINS |
| Migrations fail | Check database permissions, run manually |
| 502 Bad Gateway | Check application logs, restart service |

## 📚 Documentation

- Full Guide: `PRODUCTION_DEPLOYMENT.md`
- Detailed Steps: `RENDER_DEPLOYMENT.md`
- Checklist: `PRODUCTION_CHECKLIST.md`

## 🆘 Support

1. Check Render logs: Dashboard → Logs
2. Review documentation files above
3. Check Render status: https://status.render.com
4. Contact Render support

## 🔐 Security Reminders

- ✅ Use production credentials (not sandbox)
- ✅ Never commit `.env` files
- ✅ Enable database SSL
- ✅ Restrict CORS to your domain only
- ✅ Rotate secrets regularly
- ✅ Monitor logs for errors

---

**Need help?** See the full documentation in `PRODUCTION_DEPLOYMENT.md`
