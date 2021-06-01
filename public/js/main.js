console.log("Initialize");

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
    
    if (d.game.hasTarget) {
        Overlay.updateTargetHUD(d.teams[d.players[d.game.target]].players[d.game.target]);
    }
    else {
        $('#targetinfo').hide();
    }
});

WsSubscribers.subscribe("game", "goal_scored", (d) => {

});

WsSubscribers.subscribe("game", "match_ended", (d) => {
    $('#scoreboard').hide();
    $('.teamdetails').hide();
});