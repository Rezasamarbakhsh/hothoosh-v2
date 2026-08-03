#!/bin/bash
# ============================================
# HotHoosh v2 - Server First-Time Setup
# Run this ONCE on your fresh server
# ============================================
set -e

GREEN='\033[0;32m'
NC='\033[0m'

log() { echo -e "${GREEN}[SETUP]${NC} $1"; }

log "Updating system..."
sudo apt-get update -y

log "Installing Docker..."
curl -fsSL https://get.docker.com | sudo bash

log "Adding user to docker group..."
sudo usermod -aG docker $USER

log "Installing Git..."
sudo apt-get install -y git

log "Cloning HotHoosh v2..."
cd ~
if [ -d "~/hothoosh-v2" ]; then
    log "Repo already exists, pulling latest..."
    cd hothoosh-v2 && git pull origin main
else
    git clone https://github.com/Rezasamarbakhsh/hothoosh-v2.git
    cd hothoosh-v2
fi

log "Creating .env file..."
if [ ! -f .env ]; then
    cp .env.example .env
    SECRET=$(openssl rand -base64 48)
    sed -i "s|NEXTAUTH_SECRET=\"\"|NEXTAUTH_SECRET=\"$SECRET\"|" .env
    log "NEXTAUTH_SECRET generated automatically."
    log ""
    log "IMPORTANT: Review .env before deploying:"
    log "  nano ~/hothoosh-v2/.env"
else
    log ".env already exists, skipping."
fi

log "Using production Caddyfile..."
cp Caddyfile.prod Caddyfile

log ""
log "============================================="
log "Setup complete!"
log "============================================="
log ""
log "Next steps:"
log "  1. Log out and log back in (for docker group):"
log "     exit && ssh back in"
log ""
log "  2. Or activate docker group now:"
log "     newgrp docker"
log ""
log "  3. Deploy:"
log "     cd ~/hothoosh-v2 && ./deploy.sh"
log ""
log "  Cloudflare settings:"
log "     SSL/TLS -> Full (Strict)"
log ""
