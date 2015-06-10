// a human player
// prompts stdin for action every turn
// synchronously?
var _ = require('underscore');
var readlineSync = require('readline-sync');
var util = require('util');
var Table = require('cli-table');

var lib = require('..');

function HumanPlayer () {
  this.turn = 0;
  return lib.Player.call(this);
}

util.inherits(HumanPlayer, lib.Player);

HumanPlayer.prototype.choose = function (environment, society, relations) {
  this.turn++;

  var env_soc_table = new Table();
  env_soc_table.push(
    {'Turn': [this.turn]},
    {"Environment": _.keys(environment)},
    {"": _.values(environment)},
    {"Society": ["index", "resources"]},
    {"": [society.index, society.resources]},
    {"Values": _.keys(society.values)},
    {"": _.values(society.values)}
  );
  console.log(env_soc_table.toString());

  var relations_table = new Table();
  relations_table.push({"Relations": _.range(relations.length)});
  _.range(relations.length).forEach(function (i) {
    var row = {};
    row[i] = _.pluck(relations, i);
    relations_table.push(row);
  });
  console.log(relations_table.toString());

  console.log('How will your society act?');
  var choice_index = readlineSync.keyInSelect(lib.Choices.ALL);
  if (choice_index === -1) return process.exit();
  var choice = lib.Choices.ALL[choice_index];
  return choice;
};

module.exports = HumanPlayer;
