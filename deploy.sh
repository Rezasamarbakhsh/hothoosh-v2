#!/bin/bash
# ============================================
# HotHoosh v2 - Deploy Script
# ============================================
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh              # Full deploy (build + up)
#   ./deploy.sh --build      # Only build
#   ./deploy.sh --up         # Only start
#   ./deploy.sh --down       # Stop
#   ./deploy.sh --logs       # View logs
#   ./deploy.sh --update     # Pull + rebuild + restart
#

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

check_env() {
    if [ ! -f .env ]; then
        log_error ".env file not found!"
        echo "Create one from example:"
        echo "  cp .env.example .env"
        echo "Then edit .env with your values."
        exit 1
    fi
    log_info ".env file found"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed!"
        exit 1
    fi
    if ! docker compose version &> /dev/null; then
        log_error "Docker Compose V2 is not installed!"
        exit 1
    fi
    log_info "Docker & Docker Compose found"
}

do_build() {
    log_info "Building Docker image..."
    docker compose build --no-cache
    log_info "Build complete!"
}

do_up() {
    check_env
    log_info "Starting services..."
    docker compose up -d
    log_info "Services started!"
    echo ""
    log_info "HotHoosh is running at:"
    echo "  HTTP:  http://localhost"
    echo "  Local: http://localhost:3000"
    echo ""
    log_info "View logs: ./deploy.sh --logs"
}

do_down() {
    log_info "Stopping services..."
    docker compose down
    log_info "Services stopped."
}

do_logs() {
    docker compose logs -f --tail=100
}

do_update() {
    log_info "Pulling latest changes..."
    git pull origin main
    log_info "Rebuilding and restarting..."
    docker compose up -d --build
    log_info "Update complete!"
}

do_migrate() {
    log_info "Running database migrations..."
    docker compose exec hothoosh bunx prisma db push --accept-data-loss
    log_info "Migrations complete!"
}

# --- Main ---
case "${1:-}" in
    --build)    check_docker; do_build ;;
    --up)       check_docker; do_up ;;
    --down)     check_docker; do_down ;;
    --logs)     check_docker; do_logs ;;
    --update)   check_docker; do_update ;;
    --migrate)  check_docker; do_migrate ;;
    "")         check_docker; check_env; do_build; do_up ;;
    *)          echo "Usage: $0 [--build|--up|--down|--logs|--update|--migrate]"; exit 1 ;;
esac
