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
    var self = this;
    var history = [];
    var this_turn = new Turn(this.players);
    for (var i = 0; i < this.duration; i++) {
      history.push(this_turn);
      this_turn = this_turn.process();
    }

    // calculate winners
    var last_turn = history[history.length-1];
    var winners = last_turn.societies.map(function (society, i) {
      return society.isAlive() ? self.players[i].name : null;
    }).filter(function (x) { return x !== null; });

    return {
      history: history,
      winners: winners
    };
  }
};

module.exports = Game;
