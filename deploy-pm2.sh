#!/bin/bash
# ============================================
# HotHoosh - PM2 Deploy Script (NO Docker)
# Usage: chmod +x deploy-pm2.sh && ./deploy-pm2.sh
# ============================================
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[--]${NC} $1"; }
err() { echo -e "${RED}[ERR]${NC} $1"; }

warn "Starting HotHoosh PM2 deployment..."
echo ""

# ==========================================
# STEP 1: Pull latest code
# ==========================================
warn "Step 1: Pulling latest code..."
cd ~/hothoosh-v2
git pull origin main
log "Code updated"
echo ""

# ==========================================
# STEP 2: Stop PM2
# ==========================================
warn "Step 2: Stopping PM2..."
pm2 stop hothoosh 2>/dev/null || true
pm2 delete hothoosh 2>/dev/null || true

# Kill anything on port 3000
sudo fuser -k 3000/tcp 2>/dev/null || true
sleep 2
log "PM2 stopped"
echo ""

# ==========================================
# STEP 3: Clean build (includes static copy)
# ==========================================
warn "Step 3: Clean build..."
rm -rf .next
NODE_ENV=production npm run build

# Extra: copy static files again (belt and suspenders)
cp -r .next/static .next/standalone/.next/ 2>/dev/null || true
cp -r public .next/standalone/ 2>/dev/null || true
log "Build complete + static files copied"
echo ""

# ==========================================
# STEP 4: Update nginx config (NO-CACHE)
# ==========================================
warn "Step 4: Updating nginx config..."

sudo tee /etc/nginx/sites-available/hothoosh.ir.conf > /dev/null << 'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name hothoosh.ir www.hothoosh.ir;

    # Disable ALL caching
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0" always;
    add_header Pragma "no-cache" always;
    add_header Expires "0" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_no_cache 1;
        proxy_read_timeout 86400;
    }
}
NGINX

# Remove old configs
sudo rm -f /etc/nginx/sites-enabled/v2.hothoosh.ir.conf 2>/dev/null || true
sudo rm -f /etc/nginx/sites-available/v2.hothoosh.ir.conf 2>/dev/null || true
sudo rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

sudo ln -sf /etc/nginx/sites-available/hothoosh.ir.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
log "nginx configured with no-cache headers -> port 3000"
echo ""

# ==========================================
# STEP 5: Start PM2
# ==========================================
warn "Step 5: Starting PM2..."
cd .next/standalone
NODE_ENV=production pm2 start server.js --name hothoosh
pm2 save
log "PM2 started"
echo ""

# ==========================================
# VERIFY
# ==========================================
warn "Verifying deployment..."
sleep 3

# Check PM2 status
echo ""
pm2 status hothoosh
echo ""

# Check port 3000
if command -v fuser &>/dev/null; then
    if fuser 3000/tcp >/dev/null 2>&1; then
        log "Port 3000 is active"
    else
        err "Port 3000 is NOT active! Check PM2 logs above."
    fi
fi

# Check login page
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/login)
echo "Login page HTTP status: $RESPONSE"

# Check logo in response
if curl -s http://localhost:3000/login | grep -q "hothoosh.png"; then
    log "Logo found in login page HTML"
else
    err "Logo NOT found in login page HTML"
fi

# Check cache headers from nginx
echo ""
echo "Response headers from nginx:"
curl -sI http://localhost:3000/login | head -15
echo ""

# ==========================================
# DONE
# ==========================================
echo "==========================================="
echo -e "${GREEN}  Deployment complete!${NC}"
echo "==========================================="
echo ""
echo "  VERY IMPORTANT - Do ALL of these:"
echo "  1. Purge Cloudflare cache (Caching > Purge Everything)"
echo "  2. Clear BROWSER cache:"
echo "     Chrome: Ctrl+Shift+Delete > All time > Cached images > Clear"
echo "     OR: Open site in INCOGNITO window"
echo "     OR: Ctrl+Shift+R (hard refresh)"
echo "  3. If still old: try from phone with different network"
echo ""
echo "  PM2 commands:"
echo "    pm2 logs hothoosh    # view logs"
echo "    pm2 restart hothoosh # restart"
echo ""
