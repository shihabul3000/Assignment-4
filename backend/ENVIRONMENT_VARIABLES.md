# Backend Environment Variables

This document outlines all environment variables required for the SkillBridge backend application.

## Critical Variables for Production

The following variables **MUST** be set in your Vercel Dashboard (Project Settings > Environment Variables):

| Variable | Description | Production Value |
|----------|-------------|------------------|
| `DATABASE_URL` | PostgreSQL connection string | Same as development |
| `BETTER_AUTH_URL` | Base URL for Better Auth (no trailing /api) | `https://backend-weld-theta-88.vercel.app` |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth | Same as development |
| `JWT_SECRET` | Secret for JWT token signing | Same as development |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Same as development |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Same as development |
| `NODE_ENV` | Environment mode | `production` |

## ⚠️ Important: BETTER_AUTH_URL

The `BETTER_AUTH_URL` environment variable is **critical** for Better Auth to work correctly in production.

### What it does:
- Used by Better Auth to generate callback URLs for OAuth (Google Sign-in)
- Used for email verification links
- Used for password reset links
- Used in the `baseURL` and `trustedOrigins` configuration

### Correct Values:
- **Development**: `http://localhost:5000`
- **Production**: `https://backend-weld-theta-88.vercel.app` (without `/api`)

### Where it's used:
1. [`src/auth.ts`](src/auth.ts:20) - `baseURL` and `trustedOrigins`
2. [`src/config/index.ts`](src/config/index.ts:16) - Config export

## Setting up Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your backend project
3. Go to **Settings** > **Environment Variables**
4. Add each variable from the table above
5. **Important**: After adding variables, redeploy the project for changes to take effect

## Security Notes

- Never commit sensitive values to git
- The `.env` file is already in `.gitignore`
- The `.env.production` file in this repo is a template showing the structure
- Always use Vercel's Environment Variables for production secrets

## Verification

After deployment, verify the environment variables are set correctly by checking:
1. Google OAuth callbacks work
2. Email verification links point to the correct domain
3. Password reset functionality works
