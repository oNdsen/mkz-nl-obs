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
        
    });
});

function scorebugUpdate(data) {

}

function playerbugUpdate(data) {
    
}

function targetinfoUpdate(data) {

}

function statfeedUpdate(data) {
    
}