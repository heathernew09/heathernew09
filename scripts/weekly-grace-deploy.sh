#!/bin/bash
# ==============================================================================
# Weekly Grace Archive Deploy — unattended, launchd-triggered
# ==============================================================================
# Regenerates the Grace art archive (new days only), and if there's anything
# new, commits just those files, pushes, builds, and rsyncs to SiteGround.
# Deliberately narrower than deploy.sh: no repo-wide format/lint pass (would
# touch files unrelated to this job while unattended), and `git add` is
# scoped to the Grace archive paths only — never `git add .` — so any other
# in-progress work in the working tree is left alone.
# ==============================================================================
set -euo pipefail

REPO_DIR="/Users/agentneue/Sites/heathernew.com"
SG_USER="u1443-vg0xr9vznvhn"
SG_HOST="ssh.heathernew.com"
SG_PORT="18765"
SG_PATH="www/heathernew.com/public_html"
SG_KEY="$HOME/.ssh/id_ed25519_siteground"

cd "$REPO_DIR"

# launchd now fires this daily (see com.heathernew.grace-weekly-deploy.plist).
# For October 2026 (Inktober), deploy every day; every other month, only
# actually run on Sunday, reproducing the old weekly cadence. This is
# self-expiring — no manual revert needed once October ends.
TODAY_YEAR=$(date +%Y)
TODAY_MONTH=$(date +%-m)
TODAY_WEEKDAY=$(date +%u)   # 1=Monday .. 7=Sunday
IS_INKTOBER=false
[ "$TODAY_YEAR" = "2026" ] && [ "$TODAY_MONTH" = "10" ] && IS_INKTOBER=true

if [ "$IS_INKTOBER" = false ] && [ "$TODAY_WEEKDAY" != "7" ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Not October 2026 and not Sunday — skipping (weekly cadence outside Inktober)."
    exit 0
fi

CADENCE_LABEL="Weekly"
[ "$IS_INKTOBER" = true ] && CADENCE_LABEL="Daily (Inktober)"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting Grace archive check ($CADENCE_LABEL cadence)"

git checkout main
git pull --ff-only origin main || echo "  (pull skipped/failed — continuing with local main)"

echo "Running archive build..."
BUILD_OUTPUT=$(python3 scripts/build-grace-archive.py) && BUILD_EXIT=0 || BUILD_EXIT=$?
echo "$BUILD_OUTPUT"

if [ "$BUILD_EXIT" -eq 3 ]; then
    echo "No new days since last run. Nothing to deploy."
    exit 0
elif [ "$BUILD_EXIT" -ne 0 ]; then
    echo "❌ Archive build failed (exit $BUILD_EXIT). Aborting — nothing committed or deployed."
    exit 1
fi

NEW_COUNT=$(echo "$BUILD_OUTPUT" | grep "New thumbnails generated:" | grep -o '[0-9]*')
LATEST_DATE=$(python3 -c "import json; d=json.load(open('public/data/grace-archive.json')); print(d[-1]['date'])")

git add public/assets/grace/ public/data/grace-archive.json

if git diff --cached --quiet; then
    echo "Build reported new images but nothing staged — skipping deploy."
    exit 0
fi

git commit -m "$(cat <<EOF
$CADENCE_LABEL Grace archive update: $NEW_COUNT new day(s) through $LATEST_DATE

This was built utilizing a variety of AI tools orchestrated by a human.
EOF
)"

echo "Pushing to GitHub..."
GIT_SSH_COMMAND="ssh -i ~/.ssh/agent_id_ed25519 -o IdentitiesOnly=yes" git push origin main || git push origin main

echo "Building production assets..."
npm run build

echo "Backing up live server..."
ssh -i "$SG_KEY" "$SG_USER@$SG_HOST" -p "$SG_PORT" \
    "tar -czf backup_portfolio_$(date +%Y%m%d_%H%M%S).tar.gz --exclude='*.mp4' --exclude='*.mov' --exclude='*.MOV' --exclude='*.zip' --exclude='*.psd' -C www/heathernew.com/ public_html/"

echo "Uploading to SiteGround..."
rsync -avz --delete -e "ssh -i $SG_KEY -p $SG_PORT" dist/ "$SG_USER@$SG_HOST:$SG_PATH/"

echo "Refreshing server cache..."
ssh -i "$SG_KEY" "$SG_USER@$SG_HOST" -p "$SG_PORT" "touch $SG_PATH/index.html"

echo "Pruning old backups (keeping 2 most recent)..."
ssh -i "$SG_KEY" "$SG_USER@$SG_HOST" -p "$SG_PORT" "ls -t ~/backup_portfolio_*.tar.gz 2>/dev/null | tail -n +3 | xargs rm -f"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Deployed $NEW_COUNT new day(s) through $LATEST_DATE — https://heathernew.com/pages/grace-morning-practice.html"
