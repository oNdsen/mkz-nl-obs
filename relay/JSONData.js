module.exports = {
    beautify(raw) {
        let json = JSON.parse(raw);
        if (json.event === "game:update_state") {
            let out = this.updateState(json);

            return JSON.stringify(out);
        }

        return raw;
    },
    updateState(input) {
        return {
            event: input.event,
            data: {
                event: input.data.event,
                hasGame: input.data.hasGame,
                game: {
                    arena: input.data.game.arena,
                    ball: input.data.game.ball,
                    hasTarget: input.data.game.hasTarget,
                    hasWinner: input.data.game.hasWinner,
                    isOT: input.data.game.isOT,
                    isReplay: input.data.game.isReplay,
                    target: input.data.game.target,
                    winner: input.data.game.winner,
                    clock: {
                        sec: input.data.game.time_seconds,
                        ms: input.data.game.time_milliseconds
                    }
                },
                teams: [
                    {
                        color_primary: input.data.game.teams[0].color_primary,
                        color_secondary: input.data.game.teams[0].color_secondary,
                        name: input.data.game.teams[0].name,
                        score: input.data.game.teams[0].score,
                        players: this.getPlayers(input.data.players, 0)
                    },
                    {
                        color_primary: input.data.game.teams[1].color_primary,
                        color_secondary: input.data.game.teams[1].color_secondary,
                        name: input.data.game.teams[1].name,
                        score: input.data.game.teams[1].score,
                        players: this.getPlayers(input.data.players, 1)
                    }
                ],
                players: this.setPlayerList(input.data.players)
            }
        }
    },
    getPlayers(players, teamID) {
        let team = {};
        for (const [id, player] of Object.entries(players)) {
            if (player.team === teamID) {
                team[id] = player;
            }
        }
        return team;
    },
    setPlayerList(players) {
        let list = {};
        for (const [id, player] of Object.entries(players)) {
            list[id] = player.team;
        }
        return list;
    }
}