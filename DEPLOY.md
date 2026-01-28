# Deploy to GitHub Pages

## Quick Deploy Steps

### Option 1: Using GitHub Web Interface (Easiest)

1. **Create a new GitHub repository**
   - Go to https://github.com/new
   - Name it something like `dreaming-spanish-stats` or `spanish-stats-web`
   - Make it **Public** (required for free GitHub Pages)
   - Don't initialize with README

2. **Upload files**
   - Click "uploading an existing file"
   - Drag and drop ALL files from the `web/` folder:
     - `index.html`
     - `styles.css`
     - `api.js`
     - `data-processor.js`
     - `charts.js`
     - `app.js`
     - `server.py` (optional, for local dev)
     - `README.md`
   - Commit the files

3. **Enable GitHub Pages**
   - Go to your repository Settings
   - Click "Pages" in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Select branch: `main` (or `master`)
   - Select folder: `/ (root)`
   - Click "Save"

4. **Wait for deployment**
   - GitHub will build and deploy your site
   - Your site will be available at: `https://yourusername.github.io/repository-name`
   - This usually takes 1-2 minutes

### Option 2: Using Git Command Line

```bash
# Navigate to web folder
cd web

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Dreaming Spanish Stats Web App"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Then follow steps 3-4 from Option 1 to enable GitHub Pages.

### Option 3: Using GitHub Desktop

1. Open GitHub Desktop
2. File → Add Local Repository
3. Select the `web` folder
4. Publish repository to GitHub
5. Follow steps 3-4 from Option 1 to enable GitHub Pages

## After Deployment

1. **Visit your site**: `https://yourusername.github.io/repository-name`
2. **Enter your token** the first time
3. **Bookmark it** for easy access!

## Custom Domain (Optional)

If you want a custom domain:
1. In repository Settings → Pages
2. Enter your custom domain
3. Follow DNS setup instructions

## Updating Your Site

Just push new changes to your repository:
```bash
git add .
git commit -m "Update app"
git push
```

GitHub Pages will automatically rebuild and deploy (takes 1-2 minutes).

## Troubleshooting

**Site not loading?**
- Check repository Settings → Pages to ensure it's enabled
- Make sure repository is Public (or you have GitHub Pro)
- Wait a few minutes for initial deployment

**CORS errors?**
- GitHub Pages uses HTTPS, so CORS should work fine
- If you still see errors, check browser console for details

**Token not saving?**
- localStorage works on GitHub Pages
- Make sure you're not in incognito/private mode

## Security Note

⚠️ **Important**: Your token is stored in browser localStorage, not on GitHub. However:
- Don't commit `token.txt` or any files with tokens
- The `.gitignore` file prevents this
- Each user needs to enter their own token

## Need Help?

- GitHub Pages Docs: https://docs.github.com/en/pages
- Check your repository's Actions tab for deployment logs
