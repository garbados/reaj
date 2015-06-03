var Turn = require('./turn');

/**
@todo document this
@class
@param {array} players - list of player objects that will play the game
*/
function Game (players) {
  this.duration = 100;
  this.players = players;
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

    // calculate the winners
    var last_turn = history[history.length-1];
    var winners = this.players.map(function (player, i) {
      if (society.isAlive()) {
        return [i, player, last_turn.societies[i]];
      } else {
        return null;
      }
    }).filter(function (x) { return !!x; });

    return winners;
  }
};

module.exports = Game;
