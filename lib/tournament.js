var _ = require('underscore');

/**
@todo document this
@class
@param {array} players - list of player objects that will play the game
@param {number} rounds - number of rounds of reaj to play in the tournament
@param {number} appearances - number of times each player appear throughout the tournament
*/
function Tournament (players, rounds, appearances) {
  this.groups = _.chain(players)
    .map(function (player) {
      var result = [];
      for (var i = 0; i < appearances; i++) {
        result.push(player);
      }
      return result;
    })
    .flatten()
    .shuffle()
    .groupBy(function (player, i) {
      return i % rounds;
    })
    .value();

}

Tournament.prototype = {
  /**
  @todo document this
  @function
  */
  play: function () {
    var self = this;
    return Object.keys(this.groups).map(function (key) {
      var group = self.groups[key];
      return new Game(group);
    });
  }
};

module.exports = Tournament;
