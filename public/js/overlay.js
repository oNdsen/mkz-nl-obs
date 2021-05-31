const Overlay = {
    updateScoreboard(data) {
        $('#match-league').text(Config.settings.liga);
        $('#format').text(Config.settings.format);

        $('#team-name-blue').text(data.teams[0].name);
        $('#team-name-orange').text(data.teams[1].name);
        $('#team-score-blue').text(data.teams[0].name);
        $('#team-score-orange').text(data.teams[1].name);
    },
    updateTargetHUD(player, ballPos) {
        
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
    goalEvent(data) {
        
    },
    updateClock(clock, isOT) {
        let time = (isOT ? '+' : '') + (new Date(clock.ms * 1000)).toISOString().substr((!isOT && clock.sec < 60) ? 17 : 15, 4);
           
        if (clock.ms !== clock.sec) {
            $('#clock').text(time);
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
    }
}