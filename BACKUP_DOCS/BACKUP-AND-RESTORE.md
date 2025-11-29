# Backup and Restore Guide

## Backup Information

**Date Created:** November 27, 2025  
**Git Commit:** `294890e` - "backup: create backup files before implementing supporters discussion feature"  
**Purpose:** Secure backup before implementing merged Supporters/Comments feature

## Backed Up Files

### 1. Petition Detail Page

- **Original:** `src/app/petitions/[id]/page.tsx` (1,728 lines)
- **Backup:** `src/app/petitions/[id]/page.backup.tsx`
- **Description:** Main petition detail page with tabs, signing flow, and admin actions

### 2. Petition Signees Component

- **Original:** `src/components/petitions/PetitionSignees.tsx` (213 lines)
- **Backup:** `src/components/petitions/PetitionSignees.backup.tsx`
- **Description:** Component displaying list of petition signers

### 3. Petition Comments Component

- **Original:** `src/components/petitions/PetitionComments.tsx` (529 lines)
- **Backup:** `src/components/petitions/PetitionComments.backup.tsx`
- **Description:** Component for petition discussion/comments

## How to Restore from Local Backup Files

### Restore All Files

```bash
cd 3arida-app

# Restore petition page
cp src/app/petitions/[id]/page.backup.tsx src/app/petitions/[id]/page.tsx

# Restore signees component
cp src/components/petitions/PetitionSignees.backup.tsx src/components/petitions/PetitionSignees.tsx

# Restore comments component
cp src/components/petitions/PetitionComments.backup.tsx src/components/petitions/PetitionComments.tsx

# Verify restoration
git status
```

### Restore Individual File

```bash
cd 3arida-app

# Restore only petition page
cp src/app/petitions/[id]/page.backup.tsx src/app/petitions/[id]/page.tsx

# Or restore only signees
cp src/components/petitions/PetitionSignees.backup.tsx src/components/petitions/PetitionSignees.tsx

# Or restore only comments
cp src/components/petitions/PetitionComments.backup.tsx src/components/petitions/PetitionComments.tsx
```

## How to Restore from Git (Remote)

### Option 1: Revert to Backup Commit

```bash
cd 3arida-app

# View commit history
git log --oneline -10

# Revert to backup commit (keeps history)
git revert HEAD --no-commit
git commit -m "revert: restore petition page to backup state"

# Push to remote
git push
```

### Option 2: Hard Reset to Backup Commit (Destructive)

```bash
cd 3arida-app

# CAUTION: This will lose all commits after the backup
git reset --hard 294890e

# Force push (only if you're sure!)
git push --force
```

### Option 3: Cherry-pick Backup Commit

```bash
cd 3arida-app

# Create a new branch from backup
git checkout -b restore-backup 294890e

# Copy files from this branch
git checkout restore-backup -- src/app/petitions/[id]/page.tsx
git checkout restore-backup -- src/components/petitions/PetitionSignees.tsx
git checkout restore-backup -- src/components/petitions/PetitionComments.tsx

# Commit restoration
git add -A
git commit -m "restore: revert to backup state"
git push
```

### Option 4: View Backup Files from Git

```bash
cd 3arida-app

# View backup commit files
git show 294890e:src/app/petitions/[id]/page.tsx > page-from-backup.tsx
git show 294890e:src/components/petitions/PetitionSignees.tsx > signees-from-backup.tsx
git show 294890e:src/components/petitions/PetitionComments.tsx > comments-from-backup.tsx
```

## Quick Restore Script

Create a restore script for easy recovery:

```bash
#!/bin/bash
# restore-backup.sh

echo "🔄 Restoring petition page components from backup..."

cd 3arida-app

# Restore from local backup files
cp src/app/petitions/[id]/page.backup.tsx src/app/petitions/[id]/page.tsx
cp src/components/petitions/PetitionSignees.backup.tsx src/components/petitions/PetitionSignees.tsx
cp src/components/petitions/PetitionComments.backup.tsx src/components/petitions/PetitionComments.tsx

echo "✅ Files restored from backup"
echo "📝 Run 'git status' to see changes"
echo "🚀 Run 'git add -A && git commit -m \"restore from backup\"' to commit"
```

Make it executable:

```bash
chmod +x restore-backup.sh
```

Run it:

```bash
./restore-backup.sh
```

## Verification After Restore

After restoring, verify everything works:

```bash
cd 3arida-app

# Check file differences
git diff src/app/petitions/[id]/page.tsx

# Test locally
npm run dev

# Check for TypeScript errors
npm run build

# Deploy to production (if all looks good)
git push && vercel --prod
```

## Backup Commit Details

**Commit Hash:** `294890e`  
**Commit Message:** "backup: create backup files before implementing supporters discussion feature"  
**Date:** November 27, 2025  
**Branch:** main

**Previous Commits:**

- `ee362db` - feat: add trust indicators and inline success confirmation
- `fafe287` - feat: optimize phone verification costs - skip OTP for verified users
- `1743ca1` - fix: correct field names in PetitionSignees component
- `830881e` - feat: add duplicate signature prevention and better error messages

## What Changed After Backup

After this backup, we will implement:

- Merged Supporters tab (combining Signees + Comments)
- Signature statement field during signing
- Discussion features (replies, likes) for signers only
- 2-level reply threading
- Verified signer badges

## Emergency Rollback to Production

If production breaks after deployment:

```bash
cd 3arida-app

# Quick rollback
git revert HEAD
git push

# Redeploy previous version
vercel --prod

# Or rollback in Vercel dashboard:
# 1. Go to vercel.com/dashboard
# 2. Select your project
# 3. Go to Deployments
# 4. Find the last working deployment
# 5. Click "..." → "Promote to Production"
```

## Notes

- Backup files (`.backup.tsx`) are committed to git for safety
- They won't interfere with the app (Next.js ignores them)
- You can delete them after confirming new implementation works
- Always test locally before deploying to production
- Keep this document for future reference

## Contact

If you need to restore and something isn't working, check:

1. Git commit history: `git log --oneline`
2. Local backup files: `ls -la src/app/petitions/[id]/*.backup.tsx`
3. Vercel deployment history: vercel.com dashboard
