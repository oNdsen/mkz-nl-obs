const WebSocket = require('ws');
const { success, error, warn, info, log, indent } = require('cli-msg');

let config = {
    port: "49322",
    rocketLeagueHostname: "localhost:49122",
    debug: true
};

let player = {
    primaryID: "empty",
    name: "empty",
    score: 0,
    goals: 0,
    assists: 0,
    saves: 0,
    shots: 0,
    balltouches: 0,
    cartouches: 0,
    demos: 0
};

let team = {
    name: "empty",
    score: 0,
    players: [player, player, player]
}

let matchInfo = {
    tournamentID: "empty",
    bracketID: "empty",
    matchID: "empty",
    winner: "empty",
    teams: [team, team]
};

main(config);

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

            let data = JSON.parse(message.data.data);

            if (data.event == "game:update:state") cropData(data.game);
            else if (data.event == "game:match_ended") postMatchData(matchInfo);

            if (config.debug) console.log(matchInfo);
        }
        wsClient.onerror = function (err) {
            rlWsClientReady = false;
            error.wb(`Error connecting to Rocket League on host "${rocketLeagueHostname}"\nIs the plugin loaded into Rocket League? Run the command "plugin load sos" from the BakkesMod console to make sure`);
            // error.wb(JSON.stringify(err));
        };
    }
};

function cropData(game) {
    let arrangedTeams = arrangeTeams(unshipped);

    matchInfo.teams[0] = game.teams[0];
    matchInfo.teams[1] = game.teams[1];

    matchInfo.teams[0].players = arrangedTeams[0];
    matchInfo.teams[1].players = arrangedTeams[1];

    matchInfo.winner = game.winner;
}

function arrangeTeams(data) {
    
    //ARRANGE TEAMS
    let teamLeft = [];
    let teamRight = [];

    Object.entries(data.players).forEach(entry => {
        let tP = {};
        const [key, value] = entry;

        tP.primaryID = value.primaryID;
        tP.name = value.name;
        tP.score = value.score;
        tP.goals = value.goals;
        tP.assists = value.assists;
        tP.saves = value.saves;
        tP.balltouches = value.touches;
        tP.cartouches = value.cartouches;
        tP.demos = value.demos;

        if (value.team == 0) {           
            teamLeft.push(tP);
        }
        else { 
            teamRight.push(tP);
        }
    });

    return [teamLeft, teamRight];
}

function postMatchData(url, ship) {
    const axios = require('axios');

    axios({
        method: 'post',
        url: url,
        data: ship
    })
    .then(function (res) {
        console.log(res);
    })
    .catch(function (err) {
        console.log(err);
    });    
}

module.exports = matchInfo;