#!/bin/bash

# Heather New Portfolio Deployment Script
# Usage: ./deploy.sh

# SiteGround SSH Details
SG_USER="u1443-vg0xr9vznvhn"
SG_HOST="ssh.heathernew.com"
SG_PORT="18765"
SG_PATH="www/heathernew.com/public_html"
SG_KEY="$HOME/.ssh/portfolio_rsa_id"

echo "---------------------------------------"
echo "🚀 PHASE 1: Building & Testing Locally"
echo "---------------------------------------"

# 1. Build locally
echo "📦 Building production assets..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Aborting."
    exit 1
fi

# 2. Preview locally
echo "🌐 Starting local preview server..."
echo "👉 Opening http://localhost:4173 in Google Chrome..."

# Run preview in background and get its PID
npm run preview > /dev/null 2>&1 &
PREVIEW_PID=$!

# Wait a second for server to initialize
sleep 2

# Open Chrome automatically
open -a "Google Chrome" http://localhost:4173

# Wait for user input
echo ""
read -p "❓ Does the local preview look correct? (y/n): " CONFIRM

# Kill the preview server
kill $PREVIEW_PID

if [[ $CONFIRM != "y" && $CONFIRM != "Y" ]]; then
    echo "❌ Deployment cancelled by user. No changes committed or uploaded."
    exit 0
fi

echo ""
echo "---------------------------------------"
echo "☁️ PHASE 2: Deploying to Live Server"
echo "---------------------------------------"

# 3. Backup on server
echo "📦 Creating lean backup on server..."
ssh -i "$SG_KEY" "$SG_USER@$SG_HOST" -p "$SG_PORT" "tar -czf backup_portfolio_$(date +%Y%m%d_%H%M%S).tar.gz --exclude='*.mp4' --exclude='*.mov' --exclude='*.MOV' --exclude='*.zip' --exclude='*.psd' -C www/heathernew.com/ public_html/"

# 4. Deploy (Sync local dist/ to server public_html/)
echo "🚀 Uploading to SiteGround..."
rsync -avz --delete -e "ssh -i $SG_KEY -p $SG_PORT" dist/ "$SG_USER@$SG_HOST:$SG_PATH/"

# 5. Invalidate Cache
echo "🧹 Requesting cache refresh..."
ssh -i "$SG_KEY" "$SG_USER@$SG_HOST" -p "$SG_PORT" "touch $SG_PATH/index.html"

echo ""
echo "---------------------------------------"
echo "🐙 PHASE 3: Syncing with GitHub"
echo "---------------------------------------"

# 6. Git Commit and Push
echo "💾 Committing changes..."
git add .
read -p "📝 Enter commit message: " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="deploy: $(date +'%Y-%m-%d %H:%M:%S')"
fi

git commit -m "$COMMIT_MSG"
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ SUCCESS! Your portfolio is now live at https://heathernew.com"
