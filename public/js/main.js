console.log("Initialize");

//$('#stinger').hide();
$('#postMatchStats').hide();
$('#overlay-replay').hide();
$('#targetinfo').hide();
$('#boostmeter').hide();

WsSubscribers.subscribe("ws", "open", function() {
    WsSubscribers.send("cb", "first_connect", {
        'name': 'Scorebug',
        'version': '1'
    });
    setInterval(function () {
        WsSubscribers.send("cb", "heartbeat", "heartbeat");
    }, 1000);
});

WsSubscribers.init("localhost", 49322, false, [
    "game:update_state",
    "cb:heartbeat"
]);

WsSubscribers.subscribe("game", "update_state", (d) => {
    Overlay.updateScoreboard(d);
    Overlay.updateTeamDetails(d);
    Overlay.updateClock(d.game.clock, d.game.isOT)
    
    if (d.game.hasTarget) {
        let target = d.game.target;
        let teamID = d.players[target];
        let player = d.teams[teamID].players[target];
        $('#targetinfo').show();
        $('#boostmeter').show();
        Overlay.updateTargetHUD(player);
    }
    else {
        $('#targetinfo').hide();
        $('#boostmeter').hide();
    }
});

WsSubscribers.subscribe("game", "goal_scored", (d) => {
    setTimeout(() => {
        Overlay.playStinger('stinger');
    }, Config.settings.stingerDelay * 3);
});

WsSubscribers.subscribe("game", "replay_will_end", (d) => {
    setTimeout(() => {
        Overlay.playStinger('stinger');
    }, Config.settings.stingerDelay * 1.25);
});

WsSubscribers.subscribe("game", "match_ended", (d) => {
    $('#scoreboard').hide();
    $('.teamdetails').hide();
});