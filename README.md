# CT-DashMon 📡

**CobaTerus Dashboard Monitoring System**  
Real-time monitoring router berbasis heartbeat + Telegram alerts.

---

## 🚀 Fitur Utama

- Real-time status router online/offline.
- Alarm suara otomatis saat router offline.
- Notifikasi Telegram saat router offline/online.
- Dashboard modern dengan TailwindCSS.
- Systemd service auto-start backend.
- Setup installer otomatis dengan `install.sh`.

---

## 📦 Instalasi

1. Clone repository:

   ```bash
   git clone https://github.com/<username>/ct-dashmon.git
   cd ct-dashmon

   ```

2. Jalankan Installer
   chmod +x install.sh
   ./install.sh

3. Update file .env di folder backend/
   TELEGRAM_TOKEN=your-bot-token
   TELEGRAM_CHAT_ID=your-chat-id

4. Dashboard akan berjalan di alamat
   https://<ip_server:7000

🖥️ Teknologi yang Digunakan

    - Node.js (Express server)
    - Socket.IO (real-time communication)
    - TailwindCSS (frontend styling)
    - Telegram Bot API (alerts)
    - Systemd service (Linux auto-run)

👨‍💻 Developer

    Developed with ❤️ by CobaTerus Team
    https://cobaterus.com
