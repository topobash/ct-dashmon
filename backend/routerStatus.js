const { logStatusChange } = require("./logger");
const { sendTelegramMessage } = require("./telegram");
const fs = require("fs");
const path = require("path");

const routerData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "routers.json"), "utf8")
);
const routers = {};

function updateRouter(id) {
  const now = Date.now();

  if (!routers[id]) {
    routers[id] = {
      id,
      lastSeen: now,
      status: "online",
      alerted: false,
    };
    logStatusChange(id, "online");
    sendOnlineNotification(id); // ➕ Kirim notifikasi saat pertama kali terdeteksi
  } else {
    routers[id].lastSeen = now;

    if (routers[id].status === "offline") {
      routers[id].status = "online";
      routers[id].alerted = false; // Reset agar bisa alert offline lagi nanti
      logStatusChange(id, "online");
      sendOnlineNotification(id); // ➕ Kirim notifikasi online
    }
  }
}

function checkOfflineRouters(timeout = 70000) {
  const now = Date.now();

  for (const id in routers) {
    const r = routers[id];
    const wasOnline = r.status === "online";

    if (now - r.lastSeen > timeout) {
      r.status = "offline";

      if (wasOnline) {
        logStatusChange(id, "offline");
      }

      if (!r.alerted) {
        sendOfflineNotification(id, now - r.lastSeen);
        r.alerted = true;
      }
    } else {
      r.status = "online";
      r.alerted = false; // reset
    }
  }
}

function getRouterStatus() {
  return routerData.map((router) => {
    const statusInfo = routers[router.id] || {
      status: "offline",
      lastSeen: null,
    };

    return {
      ...router,
      status: statusInfo.status,
      lastSeen: statusInfo.lastSeen,
    };
  });
}

async function sendOfflineNotification(routerId, delay) {
  const routerInfo = routerData.find((r) => r.id === routerId);
  const message = `🚨 *ALERT*\nRouter *${routerInfo?.name || routerId}* di *${
    routerInfo?.location || "Unknown"
  }* sedang *OFFLINE*!\nLast Seen: ${Math.floor(
    delay / 1000
  )} detik yang lalu.`;
  await sendTelegramMessage(message);
}

async function sendOnlineNotification(routerId) {
  const routerInfo = routerData.find((r) => r.id === routerId);
  const message = `✅ *ONLINE*\nRouter *${routerInfo?.name || routerId}* di *${
    routerInfo?.location || "Unknown"
  }* telah *ONLINE* kembali.`;
  await sendTelegramMessage(message);
}

module.exports = { updateRouter, checkOfflineRouters, getRouterStatus };
