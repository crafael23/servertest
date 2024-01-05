const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
	res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);

server.listen(3000, () => {
	console.log("Express server started at port 3000");
});

const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ server: server });

wss.on("connection", function connection(ws) {
	const numClients = wss.clients.size;
	console.log("A new client connected. Total clients: ", numClients);

	wss.broadcast("A new client connected. Total clients: " + numClients);

	if (ws.readyState === ws.OPEN) {
		ws.send("Welcome new client");
	}

	ws.on("close", function close() {
		wss.broadcast(
			"A client disconnected. Total clients: " + wss.clients.size
		);
	});
});

wss.broadcast = function broadcast(data) {
	wss.clients.forEach(function each(client) {
		client.send(data);
	});
};
