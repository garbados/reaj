/**
A set of strategies that return a specific value
regardless of environmental or societal state.

@module
*/
var _ = require('underscore');
var Choices = require('../lib/choices');
var Player = require('../lib/player');
var util = require('util');

function ValuePlayer (choice) {
  this.choice = choice;
  this.name = choice;
  return Player.call(this);
}

ValuePlayer.prototype.choose = function () {
  return this.choice;
};

var strategies = {};

Choices.ALL.forEach(function (choice) {
  strategies[choice] = ValuePlayer.bind({}, choice);
});

module.exports = strategies;
