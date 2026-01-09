# ChamaHub Backend - Production Deployment Checklist

## Pre-Deployment Verification

### Code Quality
- [ ] All tests pass: `npm run test`
- [ ] No linting errors: `npm run lint`
- [ ] Code is formatted: `npm run format`
- [ ] All dependencies are up to date
- [ ] No console.log statements left in production code
- [ ] Error handling is comprehensive

### Security
- [ ] All sensitive data is in environment variables (not hardcoded)
- [ ] `.env` file is in `.gitignore`
- [ ] Clerk keys are production keys (not test keys)
- [ ] M-Pesa credentials are production credentials
- [ ] Database password is strong
- [ ] CORS is properly configured for your frontend domain only
- [ ] No API keys exposed in logs

### Database
- [ ] Database migrations are created and tested locally
- [ ] Migration files are committed to git
- [ ] Database schema is documented
- [ ] Backup strategy is in place
- [ ] Database user has minimal required permissions

### Configuration
- [ ] `NODE_ENV=production` is set
- [ ] `PORT` is set to 3000 (Render default)
- [ ] `DATABASE_URL` format is correct
- [ ] All required environment variables are documented
- [ ] `.env.production` template is created
- [ ] Configuration loads from environment variables

### API & Endpoints
- [ ] All endpoints are tested and working
- [ ] Error responses are consistent
- [ ] Rate limiting is considered (if needed)
- [ ] API documentation is up to date
- [ ] Health check endpoint is working: `/api/v1/health`

### Logging & Monitoring
- [ ] Logging is configured for production
- [ ] Error logging is in place
- [ ] Database logging is disabled in production
- [ ] Monitoring/alerting is set up (optional)

## Render Setup Steps

### 1. Database Setup
- [ ] Create PostgreSQL database on Render
- [ ] Note the Internal Database URL
- [ ] Test database connection locally with the URL
- [ ] Create initial schema (run migrations)

### 2. Web Service Setup
- [ ] Create Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set build command: `npm ci && npm run build`
- [ ] Set start command: `npm run start:prod`
- [ ] Choose appropriate plan (Starter recommended for production)

### 3. Environment Variables
- [ ] Add `NODE_ENV=production`
- [ ] Add `DATABASE_URL` from PostgreSQL service
- [ ] Add `CLERK_SECRET_KEY` (production)
- [ ] Add `CLERK_PUBLISHABLE_KEY` (production)
- [ ] Add `CORS_ORIGINS` with your Vercel frontend URL
- [ ] Add all M-Pesa production credentials
- [ ] Add `MPESA_CALLBACK_URL` with Render service URL
- [ ] Add `FRONTEND_URL` with Vercel URL
- [ ] Add `DB_LOGGING=false`
- [ ] Add `DB_SSL=true`

### 4. Initial Deployment
- [ ] Push code to GitHub
- [ ] Trigger deployment on Render
- [ ] Monitor build logs for errors
- [ ] Check application logs after deployment
- [ ] Verify application is running

### 5. Database Migrations
- [ ] Access Render Shell
- [ ] Run: `npm run migration:run:prod`
- [ ] Verify migrations completed successfully
- [ ] Check database schema in production

### 6. Testing
- [ ] Test health endpoint: `curl https://your-backend.onrender.com/api/v1/health`
- [ ] Test authentication endpoints
- [ ] Test database connectivity
- [ ] Test CORS from frontend
- [ ] Test M-Pesa integration (if applicable)
- [ ] Test all critical API endpoints

### 7. Frontend Integration
- [ ] Update frontend API URL to Render backend
- [ ] Update Clerk keys in frontend (if needed)
- [ ] Test frontend-backend communication
- [ ] Verify authentication flow works end-to-end

## Post-Deployment

### Monitoring
- [ ] Check Render dashboard regularly
- [ ] Monitor application logs for errors
- [ ] Monitor database performance
- [ ] Set up alerts for failures (if available)

### Maintenance
- [ ] Plan for regular backups
- [ ] Document deployment process
- [ ] Keep dependencies updated
- [ ] Monitor for security vulnerabilities
- [ ] Plan for scaling if needed

### Documentation
- [ ] Document all environment variables
- [ ] Document deployment process
- [ ] Document rollback procedure
- [ ] Document database schema
- [ ] Document API endpoints

## Rollback Procedure

If something goes wrong:

1. Go to Render dashboard
2. Click on your web service
3. Go to **Deployments** tab
4. Find the previous successful deployment
5. Click **Redeploy** on that deployment
6. Monitor logs to confirm rollback

## Common Issues & Solutions

### Build Fails
- Check logs for specific error
- Verify all dependencies in package.json
- Ensure Node version is compatible
- Try clearing build cache

### Application Won't Start
- Check environment variables are set
- Verify DATABASE_URL is correct
- Check database is running
- Review application logs

### Database Connection Issues
- Verify DATABASE_URL format
- Check PostgreSQL service is running
- Verify database credentials
- Check network connectivity

### CORS Errors
- Verify CORS_ORIGINS includes your frontend URL
- Include both http and https variants if needed
- Check frontend is making requests to correct backend URL

### Migrations Fail
- Verify migration files exist
- Check database permissions
- Review migration error logs
- May need to manually fix database state

## Support Resources

- [Render Documentation](https://render.com/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Clerk Documentation](https://clerk.com/docs)
