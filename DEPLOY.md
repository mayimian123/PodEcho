# Deployment Guide for PodEcho

This application is built with a React frontend (Vite) and a Node.js/Express backend. To deploy it to a server (e.g., Ubuntu/Debian), follow these steps.

## Prerequisites

- **Node.js**: Version 18+ recommended.
- **Git**: To clone the repository.
- **PM2**: To keep the process running.

## 1. Quick Setup Script

We have provided a deployment script. You can run:

```bash
# Make script executable
chmod +x ./deploy.sh

# Run it
./deploy.sh
```

Or follow the manual steps below.

## 2. Server Setup (Manual)

### Step 1: Clone the Repo
```bash
git clone https://github.com/mayimian123/PodEcho.git
cd PodEcho
```

### Step 2: Install Dependencies & Build Frontend
The backend is configured to serve the frontend static files from the `dist` directory.

```bash
# Install root dependencies (Frontend)
npm install

# Build the Frontend
npm run build
```

This will create a `dist` folder in the root directory.

### Step 3: Setup Backend
```bash
cd backend

# Install backend dependencies
npm install

# Create/Update .env file
# Make sure to copy your .env.example or set your API Keys!
cp ../.env .env  # Assuming you have a .env in root or just create new one
nano .env
```

Ensure your `.env` contains necessary keys (e.g., `OPENAI_API_KEY`, `GEMINI_API_KEY`, `DEEPSEEK_API_KEY`, etc.).

### Step 4: Run the Application
You can run it directly:

```bash
npm run start
```

Or better, use **PM2** for production process management:

```bash
# Install PM2 globally if not installed
npm install -g pm2

# Start the server
pm2 start src/server.ts --interpreter ./node_modules/.bin/ts-node --name "podecho"

# Save so it restarts on reboot
pm2 save
pm2 startup
```

Your service should now be running on port **3000**.

### Step 5: (Optional) Nginx Reverse Proxy
To serve on port 80 (HTTP) or 443 (HTTPS), use Nginx.

Example config (`/etc/nginx/sites-available/podecho`):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
