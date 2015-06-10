var LineByLineReader = require('line-by-line');
var _ = require('underscore');
var brain = require('brain');
var fs = require('fs');
var Choices = require('../lib/choices');
var Player = require('../lib/player');
var util = require('util');

/*

**how to train brain**

* mine environment-society-choice triplets from tournaments
* train brain on (environment,society)->choice input/output

@class
*/
function BrainPlayer () {
  var self = this;
  this.name = 'brain';
  this.brain = new brain.NeuralNetwork();
  return Player.call(this);
}

util.inherits(BrainPlayer, Player);

BrainPlayer.extend = function (init) {
  function NewBrainPlayer () {
    BrainPlayer.call(this);
    init.call(this);
  }

  util.inherits(NewBrainPlayer, BrainPlayer);

  return NewBrainPlayer;
};

BrainPlayer.prototype.train = function (training_file_path, brain_file_path) {
  var training_data = require(training_file_path).map(this.format.bind(this));
  this.brain.train(training_data);
  var json = this.brain.toJSON();
  fs.writeFileSync(brain_file_path, JSON.stringify(json));
};

BrainPlayer.prototype.restore = function (brain_file_path) {
  var text = fs.readFileSync(brain_file_path).toString();
  var json = JSON.parse(text);
  this.brain.fromJSON(json);
};

BrainPlayer.prototype.format = function (data) {
  return {
    input: this.format_input.apply(null, data.input),
    output: this.format_output.call(null, data.output)
  };
};

BrainPlayer.prototype.format_input = function (environment, society, relations) {
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

BrainPlayer.prototype.format_output = function (choice) {
  return [Choices.ALL.indexOf(choice) / (Choices.ALL.length - 1)];
};

BrainPlayer.prototype.parse_output = function (output) {
  var choice_index = Math.floor(output * (Choices.ALL.length - 1));
  var choice = Choices.ALL[choice_index];
  return choice;
};

BrainPlayer.prototype.choose = function (environment, society, relations) {
  var input = this.format_input(environment, society, relations);
  var output = this.brain.run(input);
  return this.parse_output(output);
};

module.exports = BrainPlayer;
