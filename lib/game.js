var Turn = require('./turn');

/**
@todo document this
@class
@param {array} players - list of player objects that will play the game
*/
function Game (players) {
  this.duration = 100;
  this.players = players.map(function (player) {
    return new Player();
  });
}

Game.prototype = {
  /**
  @todo document this
  @function
  */
  play: function () {
    // execute each turn
    var history = [new Turn(this.players)];
    for (var i = 0; i < this.duration; i++) {
      var this_turn = history[history.length-1];
      var next_turn = this_turn.process();
      history.push(next_turn);
    }

    // generate end-game reports for each player
    var last_turn = history[history.length-1];
    var all_choices = _.chain(history)
      .invoke('choices')
      .invoke('choices'); // get the actual array of arrays of choices
    var end_game_report = this.players.map(function (player, i) {
      var player_choices = all_choices.pluck(i).value();
      var survived_until = player_choices.indexOf(null);
      return {
        society: last_turn.societies[i],
        player: player,
        choices: player_choices,
        survived_until: survived_until
      };
    });

    // calculate winners
    var winners = last_turn.societies.map(function (society, i) {
      return society.isAlive() ? i : null;
    }).filter(function (x) { return (typeof x === 'number'); });

    return {
      reports: end_game_report,
      winners: winners
    };
  }
};

module.exports = Game;
