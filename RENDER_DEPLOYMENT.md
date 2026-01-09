# Render Deployment Guide for ChamaHub Backend

This guide walks you through deploying your NestJS backend to Render.

## Prerequisites

- Render account (https://render.com)
- GitHub repository with your code pushed
- PostgreSQL database (Render provides this)
- Environment variables ready

## Step 1: Create a PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `chamahub-db` (or your preference)
   - **Database**: `chamahub`
   - **User**: `postgres` (default)
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 15 or higher
4. Click **Create Database**
5. Wait for the database to be created (2-3 minutes)
6. Copy the **Internal Database URL** (you'll need this for the backend service)

## Step 2: Create a Web Service on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository:
   - Select your `chamahub-backend` repository
   - Click **Connect**

4. Configure the Web Service:
   - **Name**: `chamahub-backend` (or your preference)
   - **Environment**: `Node`
   - **Region**: Same as your database
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: Free or Starter (depending on your needs)

5. Click **Create Web Service**

## Step 3: Add Environment Variables

In the Render dashboard for your web service:

1. Go to **Environment** tab
2. Add the following environment variables:

```
NODE_ENV=production
PORT=3000

# Database (Render provides this automatically)
DATABASE_URL=<paste the Internal Database URL from your PostgreSQL service>

# Clerk Authentication
CLERK_SECRET_KEY=<your_clerk_secret_key>
CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>

# CORS - Update with your Vercel frontend URL
CORS_ORIGINS=https://your-frontend.vercel.app,https://www.your-frontend.vercel.app

# M-Pesa Configuration
MPESA_ENVIRONMENT=production
MPESA_CONSUMER_KEY=<your_production_consumer_key>
MPESA_CONSUMER_SECRET=<your_production_consumer_secret>
MPESA_PASSKEY=<your_production_passkey>
MPESA_SHORTCODE=<your_production_shortcode>
MPESA_INITIATOR_NAME=<your_initiator_name>
MPESA_SECURITY_CREDENTIAL=<your_production_security_credential>
MPESA_CALLBACK_URL=https://your-backend-url.onrender.com/api/v1/mpesa/callback

# Frontend URL for redirects
FRONTEND_URL=https://your-frontend.vercel.app
```

**Important Notes:**
- Replace `your-backend-url.onrender.com` with your actual Render service URL
- Replace `your-frontend.vercel.app` with your actual Vercel frontend URL
- Use production M-Pesa credentials, not sandbox

## Step 4: Database Migrations

After the service is deployed:

1. Go to your Render web service dashboard
2. Click **Shell** tab to access the service shell
3. Run migrations:
   ```bash
   npm run migration:run:prod
   ```

Alternatively, you can set up automatic migrations by modifying your start command to:
```
npm run render:deploy
```

This will run migrations automatically on each deployment.

## Step 5: Verify Deployment

1. Check the **Logs** tab in your Render dashboard
2. Look for: `Application running on: http://localhost:3000`
3. Test your API:
   ```bash
   curl https://your-backend-url.onrender.com/api/v1/health
   ```

## Step 6: Connect Frontend to Backend

Update your frontend's API configuration to use the Render backend URL:

In your frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

## Troubleshooting

### Build Fails
- Check the **Logs** tab for error messages
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### Database Connection Issues
- Verify `DATABASE_URL` is correctly set
- Check that the PostgreSQL service is running
- Ensure the database name matches your configuration

### CORS Errors
- Update `CORS_ORIGINS` to include your frontend URL
- Include both `https://` and `https://www.` variants if needed

### Migrations Not Running
- Use the Shell tab to manually run: `npm run migration:run:prod`
- Check migration files exist in `src/infrastructure/database/migrations/`

## Automatic Deployments

Render automatically deploys when you push to your connected branch. To disable:
- Go to **Settings** → **Auto-Deploy** → Toggle off

## Monitoring

- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, and request metrics
- **Events**: Deployment history and status

## Cost Considerations

- **Free Tier**: Limited resources, spins down after 15 minutes of inactivity
- **Starter Plan**: $7/month, always running
- **PostgreSQL**: Included with free tier (limited storage)

For production, consider upgrading to at least the Starter plan.

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [NestJS Deployment Guide](https://docs.nestjs.com/deployment)
- [TypeORM Migrations](https://typeorm.io/migrations)
