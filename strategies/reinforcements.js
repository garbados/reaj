var _ = require('underscore');
var Brain = require('convnet').deepqlearn.Brain;
var fs = require('fs');
var Choices = require('../lib/choices');
var Player = require('../lib/player');
var util = require('util');

/*

calculates change in societal resources turn over turn,
using that delta as the "reward" which trains behavior.

@todo store learning so it can learn across games
@class
*/
function ReinforcementPlayer () {
  var self = this;
  this.name = 'reinforcements';
  return Player.call(this);
}

util.inherits(ReinforcementPlayer, Player);

ReinforcementPlayer.extend = function (filepath) {
  function NewReinforcementPlayer () {
    this.brain_file = filepath;
    ReinforcementPlayer.call(this);
  }

  util.inherits(NewReinforcementPlayer, ReinforcementPlayer);

  return NewReinforcementPlayer;
};

ReinforcementPlayer.prototype.format_input = function (environment, society, relations) {
  return _.flatten([
    environment.land,
    environment.ecology,
    environment.resources,
    society.resources,
    society.index,
    _.values(society.values),
    relations
  ]).map(function (from, to, x) {
    return to[0] + (x - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
  }.bind(null, [-1000, 1000], [0, 1]));
};

ReinforcementPlayer.prototype.parse_output = function (output) {
  return Choices.ALL[output];
};

ReinforcementPlayer.prototype.choose = function (environment, society, relations) {
  var input = this.format_input(environment, society, relations);
  if (this.brain === undefined) {
    // initialize brain
    this.brain = new Brain(input.length, Choices.ALL.length);
  } else {
    // learn from result of last action
    var reward = society.resources - this.last_turn_resources;
    this.brain.backward(reward);
  }

  this.last_turn_resources = society.resources;
  var output = this.brain.forward(input);
  var choice = this.parse_output(output);
  return choice;
};

module.exports = ReinforcementPlayer;
