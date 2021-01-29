const WebSocket = require('ws');
const { success, error, warn, info, log, indent } = require('cli-msg');

let config = {
    port: "49322",
    rocketLeagueHostname: "localhost:49122",
    debug: true
};

function main(config) {
    /**
     * Rocket League WebSocket client
     * @type {WebSocket}
     */
    let wsClient;
    let rlWsClientReady = false;

    const wss = new WebSocket.Server({ port: config.port });
    let connections = {};
    info.wb("Opened WebSocket server on port " + config.port);

    wss.on('connection', function connection(ws) {
        let id = (+ new Date()).toString();
        success.wb("Received connection: " + id);
        connections[id] = {
            connection: ws,
            registeredFunctions: []
        };

        ws.on('message', function incoming(message) {
            sendRelayMessage(id, message);
        });

        ws.on('close', function close() {
            // Might run into race conditions with accessing connections for sending, but cant be arsed to account for this.
            // If a connection closes something will be fucked anyway
            delete connections[id];
        });
    });

    initRocketLeagueWebsocket(config.rocketLeagueHostname);
    setInterval(function () {
       if (wsClient.readyState === WebSocket.CLOSED) {
           warn.wb("Rocket League WebSocket Server Closed. Attempting to reconnect");
           initRocketLeagueWebsocket(config.rocketLeagueHostname);
       }
    }, 10000);

    function sendRelayMessage(senderConnectionId, message) {
        let json = JSON.parse(message);
        const { settings } = require('../details.json');

        let index = message.indexOf('\n    "players"');
        if (json.event === "game:update_state") {
            let first = message.slice(0, index);
            let second = message.slice(index);
            let settingsstr = `\n    "settings": ${JSON.stringify(settings)},`;
            message = first + settingsstr + second;
        }
        log.wb(senderConnectionId + "> Sent " + json.event);
        let channelEvent = (json['event']).split(':');
        if (channelEvent[0] === 'wsRelay') {
            if (channelEvent[1] === 'register') {
                if (connections[senderConnectionId].registeredFunctions.indexOf(json['data']) < 0) {
                    connections[senderConnectionId].registeredFunctions.push(json['data']);
                    info.wb(senderConnectionId + "> Registered to receive: "+json['data']);
                } else {
                    warn.wb(senderConnectionId + "> Attempted to register an already registered function: "+json['data']);
                }
            } else if (channelEvent[1] === 'unregister') {
                let idx = connections[senderConnectionId].registeredFunctions.indexOf(json['data']);
                if (idx > -1) {
                    connections[senderConnectionId].registeredFunctions.splice(idx, 1);
                    info.wb(senderConnectionId + "> Unregistered: "+json['data']);
                } else {
                    warn.wb(senderConnectionId + "> Attempted to unregister a non-registered function: "+json['data']);
                }
            }
            return;
        }

        for (let k in connections) {
            if (senderConnectionId === k) {
                continue;
            }
            if (!connections.hasOwnProperty(k)) {
                continue;
            }
            if (connections[k].registeredFunctions.indexOf(json['event']) > -1) {
                setTimeout(() => {
                    try {
                        connections[k].connection.send(message);
                    } catch (e) {
                        //The connection can close between the exist check, and sending so we catch it here and ignore
                    }
                }, 0);
            }
        }
    }

    function initRocketLeagueWebsocket(rocketLeagueHostname) {
        wsClient = new WebSocket("ws://"+rocketLeagueHostname);
        rlWsClientReady = false;

        wsClient.onopen = function open() {
            rlWsClientReady = true;
            success.wb("Connected to Rocket League on "+rocketLeagueHostname);
        }
        wsClient.onclose = function () {
            rlWsClientReady = false;
        }
        wsClient.onmessage = function(message) {
            sendRelayMessage(0, message.data);
        }
        wsClient.onerror = function (err) {
            rlWsClientReady = false;
            error.wb(`Error connecting to Rocket League on host "${rocketLeagueHostname}"\nIs the plugin loaded into Rocket League? Run the command "plugin load sos" from the BakkesMod console to make sure`);
            // error.wb(JSON.stringify(err));
        };
    }
}

module.exports = {
    main: main(config)
}