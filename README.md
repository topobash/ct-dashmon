# CT-DashMon 📡

**CobaTerus Dashboard Monitoring System**  
Real-time monitoring router berbasis heartbeat + Telegram alerts.

---

## 🚀 Fitur Utama

- Real-time status router Online / Offline
- Suara alarm otomatis saat router offline (dengan pengulangan 3x)
- Notifikasi Telegram saat router offline dan kembali online
- Dashboard responsive berbasis TailwindCSS
- Heartbeat langsung dari router MikroTik (tanpa agent tambahan)
- Installer script otomatis (`install.sh`)
- Systemd service untuk backend Node.js
- Log system auto-rotate via systemd-journald

---

## 📦 Instalasi

1. Clone repository:

   ```bash
   git clone https://github.com/topobash/ct-dashmon.git
   cd ct-dashmon

   ```

2. Jalankan Installer

   ```bash
   chmod +x install.sh
   ./install.sh

   ```

3. Update file .env di folder backend/

   TELEGRAM_TOKEN=your-bot-token
   TELEGRAM_CHAT_ID=your-chat-id

4. Dashboard akan berjalan di alamat

   https://<ip_server:7000

## Teknologi yang Digunakan

- Node.js (Express server)
- Socket.IO (real-time communication)
- TailwindCSS (frontend styling)
- Telegram Bot API (alerts)
- Systemd service (Linux auto-run)

---

## 📡 Cara Membuat Heartbeat di Router MikroTik

Agar router mengirim heartbeat ke server CT-DashMon, buat scheduler baru:
Masuk ke router menggunakan Winbox/WebFig.
Masuk menu: - System ➔ Scheduler ➔ Add (+)

Isi konfigurasi:
Field Value
Name send-heartbeat
Start Time startup
Interval 00:00:30
On Event (isi script di bawah)

Script On Event:
`bash
        /tool fetch url="http://<server-ip>:7000/heartbeat" http-method=post http-data="{\"router_id\":\"router-01\"}" http-header-field="Content-Type: application/json"
    `

Catatan:

- Ganti <server-ip> dengan IP atau domain server kamu.
- Ganti router-01 sesuai ID router di file routers.json.

---

👨‍💻 Developer

    Developed with ❤️ by CobaTerus Team
    https://cobaterus.com
