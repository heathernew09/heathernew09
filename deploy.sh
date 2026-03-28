#!/bin/bash

# ==============================================================================
# RADIA ENFORCED DEPLOYMENT WORKFLOW
# ==============================================================================
# Rule 0: Enforce code quality (Lint & Format) before anything else.
# Rule 1: Never deploy uncommitted code. Source of truth (GitHub) must be updated first.
# Rule 2: Always preview the compiled build before it hits the server.
# Rule 3: Always backup the live server before overwriting it.
# ==============================================================================

# SiteGround SSH Details
SG_USER="u1443-vg0xr9vznvhn"
SG_HOST="ssh.heathernew.com"
SG_PORT="18765"
SG_PATH="www/heathernew.com/public_html"
# Using the key established by Radia
SG_KEY="$HOME/.ssh/id_ed25519_siteground"

echo "---------------------------------------"
echo "🧼 PHASE 0: Code Quality Enforcement"
echo "---------------------------------------"

echo "🧹 Formatting code with Prettier..."
npm run format
if [ $? -ne 0 ]; then
    echo "❌ Formatting failed. Aborting."
    exit 1
fi

echo "🔍 Linting code with ESLint..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting errors found. Please fix before deploying. Aborting."
    exit 1
fi

echo ""
echo "---------------------------------------"
echo "🚀 PHASE 1: Building & Verifying Local Artifacts"
echo "---------------------------------------"

echo "📦 Compiling production assets..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Aborting deployment."
    exit 1
fi

echo "🌐 Starting local preview server for verification..."
# Run preview in background and get its PID
npm run preview > /dev/null 2>&1 &
PREVIEW_PID=$!

# Wait a second for server to initialize
sleep 2

# Attempt to open Chrome automatically (Mac specific)
open -a "Google Chrome" http://localhost:4173 || open http://localhost:4173

# Wait for user input to enforce visual check
echo ""
read -p "🛑 RADIA CHECK: Does the compiled local preview look exactly as intended? (y/n): " CONFIRM

# Kill the preview server
kill $PREVIEW_PID

if [[ $CONFIRM != "y" && $CONFIRM != "Y" ]]; then
    echo "❌ Deployment halted by user or agent. Fix the build before proceeding."
    exit 0
fi

echo ""
echo "---------------------------------------"
echo "🐙 PHASE 2: Securing Source of Truth (GitHub)"
echo "---------------------------------------"
# Enforce that code lives in version control before it lives on a server.

echo "💾 Staging changes..."
git add .

read -p "📝 Enter commit message (or press enter for default timestamp): " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="deploy: $(date +'%Y-%m-%d %H:%M:%S')"
fi

git commit -m "$COMMIT_MSG"

echo "📤 Pushing to GitHub repository..."
# Using the agent key for GitHub push if configured, otherwise standard git push
GIT_SSH_COMMAND="ssh -i ~/.ssh/agent_id_ed25519 -o IdentitiesOnly=yes" git push origin main || git push origin main

if [ $? -ne 0 ]; then
    echo "⚠️ Warning: GitHub push encountered an issue, but local commit succeeded."
    read -p "Proceed with live deployment anyway? (y/n): " PUSH_CONFIRM
    if [[ $PUSH_CONFIRM != "y" && $PUSH_CONFIRM != "Y" ]]; then
        echo "❌ Deployment halted. Fix GitHub sync first."
        exit 1
    fi
fi

echo ""
echo "---------------------------------------"
echo "☁️ PHASE 3: Live Server Deployment (Siteground)"
echo "---------------------------------------"

# Backup on server
echo "🛡️ Creating lean fallback backup on live server..."
ssh -i "$SG_KEY" "$SG_USER@$SG_HOST" -p "$SG_PORT" "tar -czf backup_portfolio_$(date +%Y%m%d_%H%M%S).tar.gz --exclude='*.mp4' --exclude='*.mov' --exclude='*.MOV' --exclude='*.zip' --exclude='*.psd' -C www/heathernew.com/ public_html/"

# Deploy (Sync local dist/ to server public_html/)
echo "🚀 Uploading compiled dist/ to SiteGround..."
rsync -avz --delete -e "ssh -i $SG_KEY -p $SG_PORT" dist/ "$SG_USER@$SG_HOST:$SG_PATH/"

# Invalidate Cache
echo "🧹 Requesting server cache refresh..."
ssh -i "$SG_KEY" "$SG_USER@$SG_HOST" -p "$SG_PORT" "touch $SG_PATH/index.html"

echo ""
echo "✅ SUCCESS! The Radia Workflow is complete. Your portfolio is live at https://heathernew.com"
