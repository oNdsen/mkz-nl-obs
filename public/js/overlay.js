

$(() => {
    let updateTeamScores = false;
    let showNoTimeInClock = false;

    WsSubscribers.init(49322, false);

    WsSubscribers.subscribe("game", "match_created", () => {
        showNoTimeInClock = false;
        $(".gameoverlay .scorebug .board .team.score").text("0");
        $(".gameoverlay .scorebug .board .info.time").text("5:00");
    });

    WsSubscribers.subscribe("game", "initialized", () => {
        //TODO Switch to Caster Overlay
    });

    WsSubscribers.subscribe("game", "pre_countdown_begin", () => {
        //TODO Switch to Game Overlay
    });

    WsSubscribers.subscribe("game", "post_countdown_begin", () => {

    });

    WsSubscribers.subscribe("game", "statfeed_event", (d) => {

    });

    WsSubscribers.subscribe("game", "goal_scored", (d) => {
        updateTeamScores = true;

        //TODO Transition with delay to Replay Overlay
        toggleGameOverlay('hidden');
        toggleReplayOverlay('visible');
    });

    WsSubscribers.subscribe("game", "replay_start", () => {

    });

    WsSubscribers.subscribe("game", "replay_will_end", () => {

    });

    WsSubscribers.subscribe("game", "replay_end", () => {
        //TODO Switch to Game Overlay
    });

    WsSubscribers.subscribe("game", "match_ended", (d) => {

    });

    WsSubscribers.subscribe("game", "podium_start", () => {
        //TODO Switch to Match Summary Overlay
    });

    WsSubscribers.subscribe("game", "update_state", (d) => {
        //Scoreboard
        scorebugUpdate(d.game, updateTeamScores, showNoTimeInClock);
        //Playerbugs
        playerbugUpdate(sortByTeam(d.players));
        //Target Player Stats
        if (d.game.hasTarget) targetinfoUpdate(d.players[d.game.target], d.game.teams);
        else {
            $('.targetinfo').css('visibility', 'hidden');
            $('.boostmeter').css('visibility', 'hidden');
            $('.targetinfo .player.stats #header').css("--targetBoost", `0px`);
        }
    });
});

function scorebugUpdate(data, uScores, sntInClock) {
    //Set Team names
    $('.gameoverlay .scorebug .board .team.name.blue').text(data.teams[0].name);
    $('.gameoverlay .scorebug .board .team.name.orange').text(data.teams[1].name);

    //Set Team Score
    $('.gameoverlay .scorebug .board .team.score.blue').text(data.teams[0].score);
    $('.gameoverlay .scorebug .board .team.score.orange').text(data.teams[1].score);

    //Set Time
    if (sntInClock) {
        $('.gameoverlay .scorebug .board .info.time').text("00.0");
    }
    else {
        $('.gameoverlay .scorebug .board .info.time').text(
            (data.isOT ? '+' : '') + reformatTime(data.time,data.time < 60 && !data.isOT)
        );
    }

    //Update Scores
    if (uScores) {
        uScores = false;
        $(".scorebug .team.score.blue").text(data.teams[0].score);
        $(".scorebug .team.score.orange").text(data.teams[1].score);
    }
}

function playerbugUpdate(data) {
    Object.entries(data).forEach(element => {
        const [key, team] = element;
        Object.entries(team).forEach(element => {
            const [id, value] = element;

            $(`.playerbug .player.p${value.index} .data .name`).text(value.name);
            $(`.playerbug .player.p${value.index} .data .boost`).text(value.boost);
            $(`.playerbug .player.p${value.index}`).css("--boost", `${value.boost}%`);

            $(`.playerbug .player.p${value.index} .data .stats.goals .stat`).text(value.goals);
            $(`.playerbug .player.p${value.index} .data .stats.assists .stat`).text(value.assists);
            $(`.playerbug .player.p${value.index} .data .stats.saves .stat`).text(value.saves);
            $(`.playerbug .player.p${value.index} .data .stats.shots .stat`).text(value.shots);

            $(`.playerbug .player.p${value.index} .form .boost`).text(value.boost);
        });

    });
}

function targetinfoUpdate(data, teams) {
    if (data.team === 0) $('body').css('--teamcolor', '#034ea4');
    else if (data.team === 1) $('body').css('--teamcolor', '#fb6a31');

    console.log(data, teams)

    $('.targetinfo .team.stats #header .name').text(data.name);
    $('.targetinfo .team.stats .value.score').text(data.score);
    $('.targetinfo .team.stats .value.goals').text(data.goals);
    $('.targetinfo .team.stats .value.assists').text(data.assists);
    $('.targetinfo .team.stats .value.saves').text(data.saves);
    $('.targetinfo .team.stats .value.shots').text(data.shots);

    console.log(teams);

    $('.targetinfo .team.stats .teamwrapper .teamname').text(teams[data.team].name);

    $('.player.boostmeter .boost.value').text(data.boost);
    $('.player.boostmeter .speed.value').text(data.speed + " kph");
    document.getElementById('boostarc').style.strokeDashoffset = animatePath(data.boost);

    $('.targetinfo').css('visibility', 'visible');
    $('.boostmeter').css('visibility', 'visible');
}

function toggleGameOverlay(visibility) {
    $('.scorebug').css('visibility', visibility);
    $('.playerbug').css('visibility', visibility);
    $('.targetinfo').css('visibility', visibility);
    $('.boostmeter').css('visibility', visibility);
}

function toggleMissingConnection(visibility) {
    $('.missing').css('visibility', visibility);
}

function toggleReplayOverlay(visibility) {
    $('.replay').css('visibility', visibility);
}

function statfeedUpdate(data) {

}

function reformatTime(time, showMs) {
    return (new Date(time * 1000)).toISOString().substr(showMs ? 17 : 15, 4);
}

function animatePath(value) {
    return 360 - (value * 3.6);
}

function sortByTeam(players) {

    let blue = {};
    let orange = {};

    Object.entries(players).forEach(entry => {
        const [key, value] = entry;

        if (value.team === 0) {
            value.index = Object.keys(blue).length++;
            blue[`${key}`] = value;
        } else {
            value.index = Object.keys(orange).length++;
            orange[`${key}`] = value;
        }
    });

    return {
        blue: blue,
        orange: orange
    };
}