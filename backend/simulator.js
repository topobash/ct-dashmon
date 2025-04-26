// backend/simulator.js

const axios = require('axios');

const routers = ['router-A', 'router-B', 'router-C'];

function sendHeartbeat(router_id) {
    axios.post('http://172.100.11.7:3000/heartbeat', { router_id })
        .then(() => console.log(`Heartbeat sent from ${router_id}`))
        .catch(err => console.error(`Failed to send heartbeat: ${err}`));
}

setInterval(() => {
    routers.forEach(router => sendHeartbeat(router));
}, 10000); // kirim setiap 10 detik
