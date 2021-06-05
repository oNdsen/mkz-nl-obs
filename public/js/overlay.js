const Overlay = {
    updateScoreboard(data) {
        $('#match-league').text(Config.settings.liga);
        $('#format').text(Config.settings.format);

        $('#team-name-blue').text(Config.settings.blue[0] || data.teams[0].name);
        $('#team-name-orange').text(Config.settings.orange[0] || data.teams[1].name);
        $('#team-score-blue').text(data.teams[0].score);
        $('#team-score-orange').text(data.teams[1].score);
    },
    updateTargetHUD(player) {
        $('#targetinfo #header .name').text(player.name);
        $('#targetinfo #statsvalue .score').text(player.score);
        $('#targetinfo #statsvalue .goals').text(player.goals);
        $('#targetinfo #statsvalue .assists').text(player.assists);
        $('#targetinfo #statsvalue .saves').text(player.saves);
        $('#targetinfo #statsvalue .shots').text(player.shots);

        if (player.team === 0) {
            $('body').css('--teamcolor', '#1388c6');
            $('.iconstats').addClass('iconstatsBlue');
            $('.iconstats').removeClass('iconstatsOrange');
        }
        else {
            $('body').css('--teamcolor', '#ff5513');
            $('.iconstats').addClass('iconstatsOrange');
            $('.iconstats').removeClass('iconstatsBlue');
        }

        $('#boostmeter .boost.value').text(player.boost);
        $('#boostmeter .speed.value').text(player.speed + " kph");
        $('#boostarc').css('stroke-dashoffset', Utils.animatePath(player.boost));
    },
    updateTeamDetails(data) {
        data.teams.forEach((team, teamID) => {
            let index = 0;
            for (const [id, player] of Object.entries(team.players)) {
                $(`#team-${teamID}-player-${index} .name`).text(player.name);
                $(`#team-${teamID}-player-${index} .stats.goals .stat`).text(player.goals);
                $(`#team-${teamID}-player-${index} .stats.assists .stat`).text(player.assists);
                $(`#team-${teamID}-player-${index} .stats.saves .stat`).text(player.saves);
                $(`#team-${teamID}-player-${index} .stats.shots .stat`).text(player.shots);
                $(`#team-${teamID}-player-${index}`).css("--boost", `${player.boost}%`);
                $(`#team-${teamID}-player-${index} .boost`).text(player.boost);
                $(`#team-${teamID}-player-${index} .formboost${teamID}`).css("width", `${player.boost}%`);

                index++;
            }
        });
    },
    updateClock(clock, isOT) {
        let time = (isOT ? '+' : '') + (new Date(clock.ms * 1000)).toISOString().substr((!isOT && clock.sec < 60) ? 17 : 15, 4);
           
        if (clock.ms !== clock.sec) {
            $('#match-time').text(time);
        }
    },
    playStinger(source) {
        document.getElementById(`${source}`).play();
    }
}

const Utils = {
    getFontSize: (len) => {
        const baseSize = 19;

        if (len >= baseSize) len = baseSize - 2;
        else len = baseSize + 2;

        const fontsize = baseSize - len;
        return `${fontsize}px`;
    },
    animatePath: (value) => {
        return 360 - (value * 3.6);
    }
}