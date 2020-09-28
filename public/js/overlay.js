$(() => {
    WsSubscribers.init(49322, false);

    WsSubscribers.subscribe("game", "match_created", () => {

    });

    WsSubscribers.subscribe("game", "initialized", () => {

    });

    WsSubscribers.subscribe("game", "pre_countdown_begin", () => {

    });

    WsSubscribers.subscribe("game", "post_countdown_begin", () => {
      
    });

    WsSubscribers.subscribe("game", "statfeed_event", (d) => {
        
    });

    WsSubscribers.subscribe("game", "goal_scored", (d) => {
        
    });

    WsSubscribers.subscribe("game", "replay_start", () => {

    });

    WsSubscribers.subscribe("game", "replay_will_end", () => {

    });

    WsSubscribers.subscribe("game", "replay_end", () => {

    });

    WsSubscribers.subscribe("game", "match_ended", (d) => {

    });

    WsSubscribers.subscribe("game", "podium_start", () => {

    });

    WsSubscribers.subscribe("game", "update_state", (d) => {
        //Scoreboard
        scorebugUpdate(d.game);
        //Playerbugs
        playerbugUpdate(sortByTeam(d.players));
        //Target Player Stats
        if(d.game.hasTarget) targetinfoUpdate(d.players[d.game.target]);
        else {
            $('.targetinfo').css('visibility', 'hidden');
            $('.boostmeter').css('visibility', 'hidden');
            $('.targetinfo .player.stats #header').css("--targetBoost", `0px`);
        }
    });
});

function scorebugUpdate(data) {
    //Set Team names
    $('.overlay .scorebug .board .team.name.blue').text(data.teams[0].name);
    $('.overlay .scorebug .board .team.name.orange').text(data.teams[1].name);

    //Set Team Score
    $('.overlay .scorebug .board .team.score.blue').text(data.teams[0].score);
    $('.overlay .scorebug .board .team.score.orange').text(data.teams[1].score);

    //Set Time
    $('.overlay .scorebug .board .info.time').text(reformatTime(data.time, true));
}

function playerbugUpdate(data) {
    Object.entries(data).forEach(element => {
        const [key, team] = element;
        Object.entries(team).forEach(element => {
            const [id, value] = element;
            
            $(`.playerbug .player.${key} .p${value.index} .data .name`).text(value.name);
            $(`.playerbug .player.${key} .p${value.index} .data .boost`).text(value.boost);
            $(`.playerbug .player.${key} .p${value.index}`).css("--boost", `${value.boost}%`);
        });
        
    });
}

function targetinfoUpdate(data) {
    $('.targetinfo .player.stats #header .name').text(data.name);
    $('.targetinfo .player.stats .value.score').text(data.score);
    $('.targetinfo .player.stats .value.goals').text(data.goals);
    $('.targetinfo .player.stats .value.assists').text(data.assists);
    $('.targetinfo .player.stats .value.saves').text(data.saves);
    $('.targetinfo .player.stats .value.shots').text(data.shots);

    $('.player.boostmeter .boost.value').text(data.boost);
    $('.player.boostmeter .speed.value').text(data.speed + " kph");
    document.getElementById('boostarc').style.strokeDashoffset = animatePath(data.boost);

    $('.targetinfo').css('visibility', 'visible');
    $('.boostmeter').css('visibility', 'visible');
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

        if (value.team == 0) {
            value.index = Object.keys(blue).length++;      
            blue[`${key}`] = value;
        }
        else { 
            value.index = Object.keys(orange).length++;
            orange[`${key}`] = value;
        }
    });

    return {
        blue: blue,
        orange: orange
    };
}