var _ = require('underscore');
var Choices = require('../lib/choices');
var Player = require('../lib/player');
var util = require('util');

/**
A strategy which makes random choices,
regardless of environmental or societal state.

@class
@implements Player
*/
function RandomPlayer () {
  return Player.call(this);
}

util.inherits(RandomPlayer, Player);

RandomPlayer.prototype.choose = function () {
  return _.sample(Choices.ALL);
};

module.exports = RandomPlayer;
