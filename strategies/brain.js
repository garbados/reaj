var brain = require('brain');
var fs = require('fs');
var Player = require('../lib/player');
var util = require('util');

/*

**how to train brain**

* mine environment-society-choice triplets from tournaments
* train brain on (environment,society)->choice input/output

@class
*/
function BrainPlayer () {
  this.name = 'brain';
  this.brain = new brain.NeuralNetwork();
  // TODO training phase
  // brain only handles values between 0 and 1
  // so reduce `land` and `ecology` etc to fractions
  // ex {input: [environment, society, relations], output:choice}
  return Player.call(this);
}

util.inherits(BrainPlayer, Player);

BrainPlayer.prototype.choose = function (environment, society, relations) {
  return this.brain.run([environment, society, relations]);
};

module.exports = BrainPlayer;
