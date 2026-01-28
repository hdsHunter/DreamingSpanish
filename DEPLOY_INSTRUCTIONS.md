# Quick Deploy Instructions

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `dreaming-spanish-stats` (or any name you like)
3. Make it **Public** (required for free GitHub Pages)
4. **Don't** initialize with README, .gitignore, or license
5. Click "Create repository"

## Step 2: Run Deployment Script

Open PowerShell in the `web` folder and run:

```powershell
.\deploy-to-github.ps1
```

When prompted, paste your repository URL (e.g., `https://github.com/YOUR_USERNAME/dreaming-spanish-stats.git`)

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select **"Deploy from a branch"**
4. Branch: **main**
5. Folder: **/ (root)**
6. Click **Save**

## Step 4: Wait & Visit

- Wait 1-2 minutes for deployment
- Your site will be at: `https://YOUR_USERNAME.github.io/REPO_NAME`

---

## Alternative: Manual Git Commands

If the script doesn't work, run these commands manually:

```powershell
cd web

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

Then follow Step 3 above to enable GitHub Pages.
