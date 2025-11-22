# Homelab Dashboard - Docker Deployment

## Prerequisites
- Docker installed on your Raspberry Pi
- Git installed

## Quick Start

### 1. Install Docker (if not already installed)
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect
```

### 2. Clone the Repository
```bash
git clone <your-github-repo-url>
cd homelab_dashboard
```

### 3. Build and Run with Docker Compose
```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The dashboard will be available at `http://<pi-ip>:3001`

## Manual Docker Commands (Alternative)

```bash
# Build the image
docker build -t homelab-dashboard .

# Run the container
docker run -d \
  --name homelab-dashboard \
  -p 3001:3001 \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  homelab-dashboard

# View logs
docker logs -f homelab-dashboard

# Stop and remove
docker stop homelab-dashboard
docker rm homelab-dashboard
```

## Data Persistence
The SQLite database is stored in the `./data` directory and persists across container restarts.

## Updating the Application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

### Check if container is running
```bash
docker ps
```

### View container logs
```bash
docker-compose logs -f
```

### Access container shell
```bash
docker exec -it homelab-dashboard sh
```

### Reset database
```bash
rm -rf data/homelab.db
docker-compose restart
```
