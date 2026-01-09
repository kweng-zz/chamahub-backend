# ChamaHub Backend - Troubleshooting Guide

This guide helps you resolve common issues during and after deployment to Render.

## 🔍 Diagnosis Steps

Before troubleshooting, follow these steps:

1. **Check Render Dashboard**
   - Go to https://dashboard.render.com
   - Select your service
   - Click **Logs** tab
   - Look for error messages

2. **Check Service Status**
   - Click **Events** tab
   - See deployment history
   - Check for failed deployments

3. **Check Metrics**
   - Click **Metrics** tab
   - Monitor CPU, memory, requests
   - Look for spikes or errors

---

## 🚨 Build Issues

### Build Fails with "npm ERR!"

**Error Message:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Causes:**
- Conflicting dependencies
- Missing package-lock.json
- Node version mismatch

**Solutions:**
1. Update dependencies locally:
   ```bash
   npm install
   npm ci
   ```
2. Commit updated `package-lock.json`:
   ```bash
   git add package-lock.json
   git commit -m "Update dependencies"
   git push origin main
   ```
3. Trigger new deployment on Render

### Build Fails with "Cannot find module"

**Error Message:**
```
Cannot find module '@nestjs/common'
```

**Causes:**
- Missing dependency in package.json
- Typo in import statement
- Dependency not installed

**Solutions:**
1. Check package.json has the dependency
2. Install locally: `npm install`
3. Verify import paths are correct
4. Commit and push changes

### Build Fails with "TypeScript Error"

**Error Message:**
```
error TS2307: Cannot find module
```

**Causes:**
- TypeScript compilation error
- Missing type definitions
- Incorrect import path

**Solutions:**
1. Run locally: `npm run build`
2. Fix TypeScript errors
3. Verify all imports are correct
4. Commit and push changes

---

## 🗄️ Database Issues

### Cannot Connect to Database

**Error Message:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Causes:**
- DATABASE_URL not set
- PostgreSQL service not running
- Wrong connection string format
- Network connectivity issue

**Solutions:**

1. **Verify DATABASE_URL is set:**
   - Go to Render Dashboard
   - Select web service
   - Go to **Environment** tab
   - Check `DATABASE_URL` exists
   - Verify format: `postgresql://user:password@host:port/database`

2. **Check PostgreSQL service:**
   - Go to Render Dashboard
   - Select PostgreSQL service
   - Check status is "Available"
   - If not, wait for it to start

3. **Test connection manually:**
   - Go to web service
   - Click **Shell** tab
   - Run: `psql $DATABASE_URL`
   - If it connects, database is working

4. **Check network:**
   - Verify web service and database are in same region
   - Check firewall rules

### Migrations Fail

**Error Message:**
```
Error: relation "users" does not exist
```

**Causes:**
- Migrations not run
- Database schema out of sync
- Migration file has errors
- Database permissions issue

**Solutions:**

1. **Run migrations manually:**
   - Go to web service
   - Click **Shell** tab
   - Run: `npm run migration:run:prod`
   - Check for error messages

2. **Check migration files:**
   - Verify files exist in `src/infrastructure/database/migrations/`
   - Check migration syntax
   - Ensure migrations are in correct order

3. **Check database permissions:**
   - Verify database user has CREATE TABLE permission
   - Check user is not read-only

4. **Reset database (if needed):**
   - Delete and recreate PostgreSQL service
   - Run migrations again
   - **Warning**: This deletes all data!

### Database Queries Slow

**Symptoms:**
- API responses are slow
- High database CPU usage
- Timeouts on queries

**Solutions:**

1. **Check query performance:**
   - Enable query logging: `DB_LOGGING=true`
   - Review logs for slow queries
   - Add database indexes

2. **Optimize queries:**
   - Use SELECT specific columns, not *
   - Add WHERE clauses
   - Use JOIN instead of multiple queries
   - Add database indexes

3. **Scale database:**
   - Upgrade to larger plan
   - Add read replicas
   - Implement caching

---

## 🔐 Authentication Issues

### "Unauthorized" Errors

**Error Message:**
```
401 Unauthorized
```

**Causes:**
- Missing Authorization header
- Invalid token
- Expired token
- Wrong Clerk keys

**Solutions:**

1. **Verify token is sent:**
   - Check request includes: `Authorization: Bearer <token>`
   - Verify token format is correct

2. **Check Clerk keys:**
   - Go to Render Dashboard
   - Check `CLERK_SECRET_KEY` is set
   - Verify it's production key (starts with `sk_live_`)
   - Not test key (starts with `sk_test_`)

3. **Verify token validity:**
   - Token should be from Clerk
   - Token should not be expired
   - Token should match user

### CORS Errors

**Error Message:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Causes:**
- Frontend URL not in CORS_ORIGINS
- CORS not properly configured
- Wrong protocol (http vs https)

**Solutions:**

1. **Add frontend URL to CORS:**
   - Go to Render Dashboard
   - Select web service
   - Go to **Environment** tab
   - Update `CORS_ORIGINS`
   - Include both `https://` and `https://www.` variants
   - Example: `https://app.vercel.app,https://www.app.vercel.app`

2. **Verify CORS configuration:**
   - Check `src/main.ts` has correct CORS setup
   - Verify origins are comma-separated
   - No spaces around commas

3. **Test CORS:**
   - Use browser DevTools
   - Check Network tab
   - Look for CORS headers in response

---

## 🌐 API Issues

### 502 Bad Gateway

**Error Message:**
```
502 Bad Gateway
```

**Causes:**
- Application crashed
- Application not responding
- Database connection lost
- Memory limit exceeded

**Solutions:**

1. **Check application logs:**
   - Go to Render Dashboard
   - Click **Logs** tab
   - Look for error messages
   - Check for crashes

2. **Restart service:**
   - Go to **Settings** tab
   - Click **Restart** button
   - Monitor logs during restart

3. **Check resource usage:**
   - Go to **Metrics** tab
   - Check CPU and memory
   - If maxed out, upgrade plan

4. **Check database connection:**
   - Verify DATABASE_URL is correct
   - Test connection manually
   - Check PostgreSQL service is running

### 404 Not Found

**Error Message:**
```
404 Not Found
```

**Causes:**
- Wrong endpoint URL
- Endpoint not implemented
- API prefix not included

**Solutions:**

1. **Verify endpoint URL:**
   - Check URL format: `/api/v1/endpoint`
   - Verify endpoint exists
   - Check HTTP method (GET, POST, etc.)

2. **Check API prefix:**
   - All endpoints should start with `/api/v1`
   - Example: `https://backend.onrender.com/api/v1/health`

3. **Test health endpoint:**
   ```bash
   curl https://chamahub-backend.onrender.com/api/v1/health
   ```

### 500 Internal Server Error

**Error Message:**
```
500 Internal Server Error
```

**Causes:**
- Unhandled exception
- Database error
- Missing environment variable
- Code bug

**Solutions:**

1. **Check logs:**
   - Go to Render Dashboard
   - Click **Logs** tab
   - Look for error stack trace

2. **Check environment variables:**
   - Verify all required variables are set
   - Check values are correct
   - No typos in variable names

3. **Test locally:**
   - Reproduce error locally
   - Debug with `npm run start:dev`
   - Fix code issue

4. **Check database:**
   - Verify database connection
   - Check database schema
   - Run migrations if needed

---

## 📊 Performance Issues

### High CPU Usage

**Symptoms:**
- Service is slow
- Requests timeout
- CPU usage near 100%

**Solutions:**

1. **Identify bottleneck:**
   - Check logs for slow operations
   - Monitor specific endpoints
   - Profile application

2. **Optimize code:**
   - Reduce database queries
   - Add caching
   - Optimize algorithms
   - Use indexes

3. **Scale service:**
   - Upgrade to larger plan
   - Add more instances
   - Implement load balancing

### High Memory Usage

**Symptoms:**
- Service crashes
- Out of memory errors
- Memory usage near limit

**Solutions:**

1. **Find memory leak:**
   - Check logs for memory errors
   - Monitor memory over time
   - Look for growing memory usage

2. **Fix memory leak:**
   - Review code for circular references
   - Check for unclosed connections
   - Verify event listeners are removed

3. **Scale service:**
   - Upgrade to larger plan
   - Increase memory limit
   - Implement garbage collection

---

## 🔄 Deployment Issues

### Deployment Stuck

**Symptoms:**
- Deployment not progressing
- Build taking too long
- Service not starting

**Solutions:**

1. **Check build logs:**
   - Go to Render Dashboard
   - Click **Deployments** tab
   - Click on stuck deployment
   - Check logs for errors

2. **Cancel and retry:**
   - Click **Cancel** on stuck deployment
   - Make a small code change
   - Push to GitHub
   - Trigger new deployment

3. **Check resource limits:**
   - Verify plan has enough resources
   - Check for rate limiting
   - Upgrade plan if needed

### Rollback Needed

**Symptoms:**
- New deployment has bugs
- Need to revert to previous version

**Solutions:**

1. **Rollback via Render:**
   - Go to Render Dashboard
   - Click **Deployments** tab
   - Find previous successful deployment
   - Click **Redeploy**
   - Monitor logs

2. **Rollback via Git:**
   - Revert commit: `git revert <commit-hash>`
   - Push to GitHub: `git push origin main`
   - Render will auto-deploy

---

## 🧪 Testing & Validation

### Test Health Endpoint

```bash
curl https://chamahub-backend.onrender.com/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test Database Connection

```bash
# Via Render Shell
psql $DATABASE_URL -c "SELECT 1"
```

Expected output:
```
 ?column?
----------
        1
(1 row)
```

### Test API Endpoint

```bash
curl -H "Authorization: Bearer <token>" \
  https://chamahub-backend.onrender.com/api/v1/chamas
```

### Test CORS

```bash
curl -H "Origin: https://your-frontend.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://chamahub-backend.onrender.com/api/v1/health
```

---

## 📝 Logging & Debugging

### Enable Debug Logging

1. Set environment variable:
   ```
   DB_LOGGING=true
   ```

2. Restart service:
   - Go to **Settings** tab
   - Click **Restart**

3. Check logs:
   - Go to **Logs** tab
   - Look for SQL queries and debug info

### View Detailed Logs

```bash
# Via Render Shell
tail -f /var/log/render.log
```

### Export Logs

1. Go to Render Dashboard
2. Click **Logs** tab
3. Click **Export** button
4. Download log file

---

## 🆘 Getting Help

### Before Contacting Support

1. Check this troubleshooting guide
2. Review Render logs
3. Check Render status page: https://status.render.com
4. Search Render documentation
5. Check GitHub issues

### Contact Support

- **Render Support**: https://render.com/support
- **NestJS Issues**: https://github.com/nestjs/nest/issues
- **TypeORM Issues**: https://github.com/typeorm/typeorm/issues

### Provide Information

When asking for help, provide:
- Error message (full text)
- Render logs (relevant section)
- Environment variables (without secrets)
- Steps to reproduce
- Expected vs actual behavior

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Status Page](https://status.render.com)
- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Last Updated**: January 2024
**Version**: 1.0.0
