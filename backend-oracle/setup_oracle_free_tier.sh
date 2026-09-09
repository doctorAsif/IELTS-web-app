#!/usr/bin/env bash
# ==============================================================================
# AKHL IELTS Web Application - 1-Click Oracle Always Free Deployment Script
# Targets: Ubuntu 24.04 LTS on Oracle Cloud Infrastructure (OCI) Ampere A1
# Allocations: 4 OCPU, 24 GB RAM, 200 GB Storage, 10 TB Bandwidth (100% FREE)
# ==============================================================================

set -e

echo "=== [1/5] Updating Ubuntu Packages on Oracle VPS ==="
sudo apt-get update && sudo apt-get upgrade -y

echo "=== [2/5] Installing Docker & Docker Compose Plugin ==="
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER

echo "=== [3/5] Opening Firewall Ports (80, 443, 8000) on Oracle Linux iptables ==="
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8000 -j ACCEPT
sudo netfilter-persistent save || true

echo "=== [4/5] Launching 24/7 Container Cluster via Docker Compose ==="
cd "$(dirname "$0")"
docker compose down || true
docker compose up -d --build

echo "=== [5/5] Deployment Succeeded! ==="
echo "Your AKHL IELTS 24/7 Backend is running on Oracle Cloud Always Free Tier."
echo "Access health check at: http://$(curl -s ifconfig.me)/health"
