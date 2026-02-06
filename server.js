const WebSocket = require('ws');
const fs = require('fs');

const wss = new WebSocket.Server({ port: 8080 });
console.log("GALACTIC AEGIS SERVER: Running on port 8080");

let players = {};

wss.on('connection', (ws) => {
    const id = `PILOT-${Math.floor(Math.random() * 9000)}`;
    players[id] = { id, x: 500000, y: 500000 };

    ws.on('message', (data) => {
        const msg = JSON.parse(data);

        // Handle Bug Reports
        if (msg.type === 'REPORT_BUG') {
            fs.appendFileSync('alpha_bugs.json', JSON.stringify(msg) + '\n');
            console.log(`[BUG REPORTED] by ${msg.playerId}`);
            return;
        }

        // Handle Chat/Broadcast
        if (msg.type === 'CHAT') {
            const packet = JSON.stringify({ type: 'CHAT', sender: id, text: msg.text });
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) client.send(packet);
            });
        }
    });

    ws.send(JSON.stringify({ type: 'WELCOME', id }));
});