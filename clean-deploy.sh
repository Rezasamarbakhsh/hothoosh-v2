#!/bin/bash
# ============================================
# HotHoosh v2 - Full Server Reset & Deploy
# Removes old project, deploys new on hothoosh.ir
# ============================================
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[--]${NC} $1"; }

warn "Starting full server cleanup..."
echo ""

# ==========================================
# STEP 1: Add 4GB Swap (prevent OOM)
# ==========================================
warn "Step 1: Adding 4GB swap..."

# Remove old swap if exists
sudo swapoff /swapfile 2>/dev/null || true
sudo rm -f /swapfile

sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
if ! grep -q '/swapfile' /etc/fstab; then
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

log "4GB swap active"
echo ""

# ==========================================
# STEP 2: Stop & Remove old project
# ==========================================
warn "Step 2: Removing old project..."

# Stop any PM2/node processes
sudo pm2 stop all 2>/dev/null || true
sudo pm2 delete all 2>/dev/null || true
sudo systemctl stop hothoosh 2>/dev/null || true
sudo systemctl disable hothoosh 2>/dev/null || true

# Kill any node processes on port 3000
sudo fuser -k 3000/tcp 2>/dev/null || true
sudo fuser -k 3001/tcp 2>/dev/null || true

# Stop Docker containers
if command -v docker &>/dev/null; then
    cd ~/hothoosh-v2 2>/dev/null && docker compose down 2>/dev/null || true
    docker rm -f $(docker ps -aq) 2>/dev/null || true
fi

log "Old project stopped"
echo ""

# ==========================================
# STEP 3: Find & remove old project files
# ==========================================
warn "Step 3: Finding old project files..."

# Show what's running on nginx
echo "Current nginx sites:"
ls /etc/nginx/sites-enabled/ 2>/dev/null || echo "  (none)"
echo ""

# Common locations for the old project
OLD_DIRS=""
for dir in /var/www/hothoosh /var/www/hothoosh.ir /var/www/html /home/*/hothoosh /home/*/hothoosh.ir /opt/hothoosh /root/hothoosh; do
    if [ -d "$dir" ] && [ "$dir" != "$(cd ~/hothoosh-v2 2>/dev/null && pwd)" ]; then
        OLD_DIRS="$OLD_DIRS $dir"
        echo "  Found: $dir"
    fi
done

# Remove old nginx configs except v2
for conf in /etc/nginx/sites-enabled/*; do
    [ -f "$conf" ] || continue
    basename=$(basename "$conf")
    if [ "$basename" != "v2.hothoosh.ir.conf" ]; then
        echo "  Removing nginx config: $basename"
        sudo rm -f "$conf"
        sudo rm -f "/etc/nginx/sites-available/$basename"
    fi
done

echo ""

# ==========================================
# STEP 4: Remove v2 subdomain config
# ==========================================
warn "Step 4: Switching to root domain..."

sudo rm -f /etc/nginx/sites-enabled/v2.hothoosh.ir.conf
sudo rm -f /etc/nginx/sites-available/v2.hothoosh.ir.conf

log "v2 subdomain config removed"
echo ""

# ==========================================
# STEP 5: Create new nginx config for hothoosh.ir
# ==========================================
warn "Step 5: Creating nginx config for hothoosh.ir..."

sudo tee /etc/nginx/sites-available/hothoosh.ir.conf > /dev/null << 'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name hothoosh.ir www.hothoosh.ir;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/hothoosh.ir.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

log "nginx configured for hothoosh.ir -> port 3001"
echo ""

# ==========================================
# STEP 6: Update .env for root domain
# ==========================================
warn "Step 6: Updating .env..."

cd ~/hothoosh-v2

if [ ! -f .env ]; then
    cp .env.example .env
fi

# Update NEXTAUTH_URL
sed -i 's|NEXTAUTH_URL=.*|NEXTAUTH_URL="https://hothoosh.ir"|' .env

# Generate secret if empty
if grep -q 'NEXTAUTH_SECRET=""' .env; then
    SECRET=$(openssl rand -base64 48)
    sed -i "s|NEXTAUTH_SECRET=""|NEXTAUTH_SECRET="$SECRET"|" .env
    log "NEXTAUTH_SECRET generated"
fi

log ".env updated for hothoosh.ir"
echo ""

# ==========================================
# STEP 7: Clean Docker & Build
# ==========================================
warn "Step 7: Cleaning Docker cache & building..."

# Free memory before build
docker system prune -af --volumes 2>/dev/null || true

log "Docker cache cleaned. Starting build (this takes a few minutes)..."
docker compose up -d --build --force-recreate

log "Build & deploy complete!"
echo ""

# ==========================================
# DONE
# ==========================================
echo "==========================================="
echo -e "${GREEN}  Deployment complete!${NC}"
echo "==========================================="
echo ""
echo "  URL: https://hothoosh.ir"
echo "  Port: 3001 (internal)"
echo ""
echo "  Cloudflare:"
echo "    - Make sure root '@' record points to $(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP')"
echo "    - SSL/TLS mode: Full (Strict)"
echo ""
echo "  Useful commands:"
echo "    docker logs -f hothoosh-v2    # view logs"
echo "    docker restart hothoosh-v2     # restart"
echo ""

# Show container status
echo "Container status:"
docker ps --filter name=hothoosh-v2 --format "  {{.Status}} - {{.Ports}}"
