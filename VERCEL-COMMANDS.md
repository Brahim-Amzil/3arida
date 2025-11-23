# Vercel Quick Command Reference

## Environment Variables

### List all environment variables

```bash
vercel env ls
```

### Add a new environment variable

```bash
vercel env add VARIABLE_NAME
# Then select: Production, Preview, Development (or all)
# Then enter the value
```

### Pull environment variables to local file

```bash
vercel env pull .env.vercel
```

### Remove an environment variable

```bash
vercel env rm VARIABLE_NAME
```

## Deployment

### Deploy to production

```bash
vercel --prod
```

### Deploy with cache bypass (fresh build)

```bash
vercel --prod --force
```

### Deploy to preview

```bash
vercel
```

### Check deployment logs

```bash
vercel logs
```

### Check deployment status

```bash
vercel ls
```

## Project Management

### Link local project to Vercel

```bash
vercel link
```

### View project info

```bash
vercel inspect
```

### Open project in browser

```bash
vercel open
```

## Useful Scripts (in this project)

### Check environment variables locally

```bash
node check-env.js
```

### Redeploy with cache clear

```bash
./redeploy-vercel.sh
```

## Common Workflows

### Adding new environment variable

```bash
# 1. Add to Vercel
vercel env add NEW_VARIABLE

# 2. Redeploy to pick up changes
vercel --prod --force

# 3. Verify it's set
vercel env ls
```

### Debugging environment issues

```bash
# 1. Check what's set in Vercel
vercel env ls

# 2. Pull to local file
vercel env pull .env.vercel

# 3. Check the file
cat .env.vercel

# 4. Compare with requirements
node check-env.js
```

### Fresh deployment after env changes

```bash
# Option 1: Use our script
./redeploy-vercel.sh

# Option 2: Manual
vercel --prod --force
```

## Tips

- Always use `--force` flag after changing environment variables to bypass cache
- NEXT*PUBLIC*\* variables are exposed to the browser
- Non-NEXT_PUBLIC variables are server-side only
- Environment variables are set per environment (Production/Preview/Development)
- Changes to env vars require redeployment to take effect
