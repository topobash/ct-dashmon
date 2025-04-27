
#!/bin/bash

echo "======================================"
echo "🚀 CT-DashMon Installer"
echo "======================================"

SCRIPT_DIR=$(dirname "$(realpath "$0")")
cd "$SCRIPT_DIR"

# 1. Install Node modules
echo "📦 Installing npm dependencies..."
cd backend
npm install

# 2. Copy .env template kalau belum ada
if [ ! -f ".env" ]; then
  echo "📄 Creating .env file..."
  cp .env.example .env
fi
cd ..

# 3. Setup systemd service
echo "🛠️ Setting up systemd service..."

sudo cp dash-mon.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable dash-mon.service
sudo systemctl restart dash-mon.service

# 4. Finished
echo "✅ CT-DashMon installation complete!"
echo "Access your dashboard at: http://<your-server-ip>:3000"
