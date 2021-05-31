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
});

WsSubscribers.subscribe("game", "statfeed_event", (d) => {

});

WsSubscribers.subscribe("game", "goal_scored", (d) => {

});

WsSubscribers.subscribe("game", "replay_will_end", (d) => {

});

WsSubscribers.subscribe("game", "replay_end", (d) => {

});

WsSubscribers.subscribe("game", "post_countdown_begin", (d) => {

});

WsSubscribers.subscribe("game", "match_ended", (d) => {
    $('#scoreboard').hide();
    $('.teamdetails').hide();
});