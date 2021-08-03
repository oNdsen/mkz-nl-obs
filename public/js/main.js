console.log("Initialize");

switch (Config.settings.blue[1]) {
    case '1':
        $('.seriesBlue .first').show();
        $('.seriesBlue .second').hide();
        $('.seriesBlue .third').hide();
        break;
    case '2':
        $('.seriesBlue .first').show();
        $('.seriesBlue .second').show();
        $('.seriesBlue .third').hide();
        break;
    case '3':
        $('.seriesBlue .first').show();
        $('.seriesBlue .second').show();
        $('.seriesBlue .third').show();
        break;
    default:
        $('.seriesBlue .first').hide();
        $('.seriesBlue .second').hide();
        $('.seriesBlue .third').hide();
        break;
}


switch (Config.settings.orange[1]) {
    case '1':
        $('.seriesOrange .first').show();
        $('.seriesOrange .second').hide();
        $('.seriesOrange .third').hide();
        break;
    case '2':
        $('.seriesOrange .first').show();
        $('.seriesOrange .second').show();
        $('.seriesOrange .third').hide();
        break;
    case '3':
        $('.seriesOrange .first').show();
        $('.seriesOrange .second').show();
        $('.seriesOrange .third').show();
        break;
    default:
        $('.seriesOrange .first').hide();
        $('.seriesOrange .second').hide();
        $('.seriesOrange .third').hide();
        break;
}

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
    if (d.scorer.teamnum === 0) {
        $('#overlay-replay').addClass("replayBlue");
        $('#overlay-replay').removeClass("replayOrange");
    }
    else {
        $('#overlay-replay').addClass("replayOrange");
        $('#overlay-replay').removeClass("replayBlue");
    }

    console.log(d);

    $('.ballspeed').text(Math.round(d.goalspeed));
    $('.scorer').text(d.scorer.name);
    if(d.assister.name !== "") {
        $('.assister').show();
        $('.assister').text(d.assister.name);
    }
    else {
        $('.assister').hide();
    }
   

    setTimeout(() => {
        Overlay.playStinger('stinger');
    }, Config.settings.stingerDelay * 3);
});

WsSubscribers.subscribe("game", "replay_start", () => {
    Overlay.hideGameOverlay();
    $('#overlay-replay').show();
});

WsSubscribers.subscribe("game", "replay_end", () => {
    Overlay.showGameOverlay();
    $('#overlay-replay').hide();
});

WsSubscribers.subscribe("game", "replay_will_end", () => {
    setTimeout(() => {
        Overlay.playStinger('stinger');
    }, Config.settings.stingerDelay * 1.5);
});

WsSubscribers.subscribe("game", "podium_start", () => {
    Overlay.hideGameOverlay();
});
