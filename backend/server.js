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

// Load API Key dari .env
const API_KEY_ROUTERS = process.env.API_KEY_ROUTERS || "default-key";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

app.use(cors());
app.use(express.json());

// Serve Frontend
app.use("/", express.static(path.join(__dirname, "../frontend")));

// ------------------------------ ROUTES ------------------------------- //

// Login admin (check password)
app.post('/admin-login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
});

// Public: Get daftar routers
app.get("/routers", (req, res) => {
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

// Protected: Tambah router
app.post('/routers', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY_ROUTERS) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const newRouter = req.body;
  const filePath = path.join(__dirname, 'routers.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Failed to load routers');

    let routers = JSON.parse(data);
    routers.push(newRouter);

    fs.writeFile(filePath, JSON.stringify(routers, null, 2), (err) => {
      if (err) return res.status(500).send('Failed to save router');
      res.status(201).json({ message: 'Router addes' });
    });
  });
});

// Protected: Update router
app.put('/routers/:id', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY_ROUTERS) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const routerId = req.params.id;
  const updatedRouter = req.body;

  const filePath = path.join(__dirname, 'routers.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Failed to load routers');

    let routers = JSON.parse(data);
    const index = routers.findIndex(r => r.id === routerId);
    if (index === -1) return res.status(404).send('Router not found');

    routers[index] = { ...routers[index], ...updatedRouter };

    fs.writeFile(filePath, JSON.stringify(routers, null, 2), (err) => {
      if (err) return res.status(500).send('Failed to update router');
      res.json({ message: 'Router updated' });
    });
  });
});

// Protected: Delete router
app.delete('/routers/:id', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY_ROUTERS) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const routerId = req.params.id;

  const filePath = path.join(__dirname, 'routers.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Failed to load routers');

    let routers = JSON.parse(data);
    routers = routers.filter(r => r.id !== routerId);

    fs.writeFile(filePath, JSON.stringify(routers, null, 2), (err) => {
      if (err) return res.status(500).send('Failed to delete router');
      res.json({ message: 'Router deleted' });
    });
  });
});



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

const PORT = 7000;
server.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
