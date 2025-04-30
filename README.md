# CT-DashMon 📡

**CobaTerus Dashboard Monitoring System**  
Sistem ini berfungsi sebagai monitoring router (mikrotik) secara Real-time berbasis heartbeat + Telegram alerts.

![image](https://github.com/user-attachments/assets/85248cd6-a556-4332-a695-bb64c98e744d)


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

   sebelum menjalankan installer, ubah file **dash-mon.service** dan sesuaikan bagian "User" dan "Group" serta "WorkingDirectory"
   kemudian jalankan perintah berikut:
   <ul>
      <li>User <-- diisi dengan user system</li>
         <li>Group <-- diisi dengan Group dari user </li>
      <li>WorkingDirectory <-- sesuaikan dengan direktori aplikasi ini berada</li>
   </ul>
   
   ```bash
   chmod +x install.sh
   ./install.sh

   ```

4. Update file .env di folder backend/

   TELEGRAM_TOKEN=your-bot-token
   
   TELEGRAM_CHAT_ID=your-chat-id
   
   API_KEY_ROUTERS = API Key untuk autentikasi routers.json
   
   ADMIN_PASSWORD = Password login admin panel

6. Dashboard akan berjalan di alamat

   https://<ip_server>:7000 // <-- Ubah <ip_server> sesuai dengan ip pada komputer server

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

- Name         => send-heartbeat
- Start Time   => startup
- Interval     => 00:00:30
- On Event     => (isi script di bawah)

Script On Event:
   ```bash
   /tool fetch url="http://<server-ip>:7000/heartbeat" http-method=post http-data="{\"router_id\":\"router-01\"}" http-header-field="Content-Type: application/json"
   ```

Ubah isi dari file **routers.json** yang berada pada folder backend. Sesuaikan id router, name router dan location router.

Catatan:

- Ganti <server-ip> dengan IP atau domain server kamu.
- Ganti router-01 sesuai ID router di file routers.json.

---

👨‍💻 Developer

Beliin kopi? boleh banget: [Buat Beli Kopi](https://saweria.co/topobasah)

    Developed with ❤️ by TopoBasah
    https://cobaterus.com
