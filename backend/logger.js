const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, 'router-status.log');

function logStatusChange(routerId, status) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${routerId} is ${status.toUpperCase()}\n`;

    fs.appendFile(logFile, logEntry, (err) => {
        if (err) console.error('Failed to write log:', err);
    });
}

module.exports = { logStatusChange };
