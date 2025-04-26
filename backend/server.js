// backend/server.js
require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const {
  updateRouter,
  checkOfflineRouters,
  getRouterStatus,
} = require("./routerStatus");

const { logStatusChange } = require("./logger");
const { fstat } = require("fs");

// const jwt = require('jsonwebtoken');
// const SECRET_KEY = 'dash-mon-987987';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "../frontend")));

app.get("/routers", (req, res) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== "dash-mon-routers-key") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const filePath = path.join(__dirname, "routers.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading routers.json:", err);
      return res.status(500).send("Failed to load routers");
    }
    try {
      const routers = JSON.parse(data);
      res.json(routers);
    } catch (parseError) {
      console.log("Invalid JSON format:", parseError);
      res.status(500).send("Corrupt routers file");
    }
  });
});

const PORT = 3000;

// Receive heartbeat from router
// const routerStatus = {};
// app.post('/heartbeat', (req, res) => {
//     const { router_id } = req.body;

//     if (router_id) {
//       const now = Date.now();
//       routerStatus[router_id] = now;

//       // ✅ Tambahkan log di sini
//       console.log(`Heartbeat received from ${router_id} at ${new Date().toISOString()}`);

//       res.sendStatus(200);
//     } else {
//       res.status(400).json({ error: "Missing router_id" });
//     }
//   });

// app.post('/heartbeat', (req, res) => {
//     const { router_id } = req.body;
//     if (!router_id) return res.status(400).send('Missing router_id');

//     updateRouter(router_id);
//     res.send('OK');
// });

app.post("/heartbeat", (req, res) => {
  const { router_id } = req.body;

  if (router_id) {
    updateRouter(router_id); // ✅ Gunakan fungsi updateRouter yang sudah ada
    console.log(
      `Heartbeat received from ${router_id} at ${new Date().toISOString()}`
    );
    res.sendStatus(200);
  } else {
    res.status(400).json({ error: "Missing router_id" });
  }
});

// Emit status every 5s
setInterval(() => {
  checkOfflineRouters(70000);
  io.emit("status_update", getRouterStatus());
}, 5000);

// WebSocket client connection
io.on("connection", (socket) => {
  console.log("Frontend connected via WebSocket");
  socket.emit("status_update", getRouterStatus());
});

server.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
