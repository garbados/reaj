var brain = require('brain');
var fs = require('fs');
var reaj = require('../reaj');
var util = require('util');
var Choices = lib.Choices;
var Player = lib.Player;

/*

assumes others will use the same evaluative criteria as itself for considering how others will act.
see [cournot competition](http://en.wikipedia.org/wiki/Cournot_competition) for inspiration.

@class
*/

function CournotPlayer () {
  this.name = 'cournot';
  return Player.call(this);
}

util.inherits(CournotPlayer, Player);

CournotPlayer.prototype.choose = function (environment, society, relations) {
  // TODO
};

module.exports = CournotPlayer;
