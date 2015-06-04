var _ = require('underscore');
var Turn = require('./turn');

/**
@todo document this
@class
@param {array} players - list of player objects that will play the game
*/
function Game (players) {
  this.duration = 100;
  this.players = players.map(function (Player) {
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
    var history = [];
    var this_turn = new Turn(this.players);
    for (var i = 0; i < this.duration; i++) {
      history.push(this_turn);
      this_turn = this_turn.process();
    }

    // generate end-game reports for each player
    var last_turn = history[history.length-1];
    var all_choices = history.map(function (turn, j) {
      return turn.choices;
    });
    var end_game_report = this.players.map(function (player, i) {
      var player_choices = _.pluck(all_choices, i).filter(function (x) { return x; });
      var survived_until = player_choices.length;
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
