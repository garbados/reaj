var _ = require('underscore');
var clone = require('clone');
var Environment = require('./environment');
var Society = require('./society');

/**
A single turn of the game.
Used to maintain history.

@class
@param {array} players - an array of functions representing each player's decision mechanism
@param {object} environment - (optional) the environment before this turn. if undefined, a new environment is created.
@param {array} societies - (optional) an array of societies. if undefined, or length 0, initializes an array of new societies based on the number of players.
@param {array} relations - (optional) a 2-dimensional square matrix of relations between societies. if undefined, or length 0, initializes a new matrix based on the number of players.
*/
function Turn (players, environment, societies, relations) {
  this.players = players;
  this.environment = clone(environment) || new Environment();
  this.societies = (societies && societies.length) ? clone(societies) : players.map(function (_, i) {
    return new Society(i);
  });
  this.relations = (relations && relations.length) ? clone(relations) : players.map(function () {
    return _.range(players.length).map(function () {
      return 0;
    });
  });
}

Turn.prototype = {
  /**
  Takes the following steps in order:

  1. get each society's choice given the current environment and relations matrix.
  2. modify the environment according to those choices.
  3. modify each society according to those choices.
  4. modify the environment according to its state.
  5. modify each society according to its state.

  Having updated its environment, societies, and relations matrix,
  returns the next turn.

  @function
  @returns {turn} the next turn, already initialized with the updates environment, societies, and relations
  */
  process: function () {
    this._choices = this._get_choices();
    this.choices = new Choices(this._choices);
    this._process_choices_on_environment();
    this._process_choices_on_societies();
    this._process_state_of_environment();
    this._process_state_of_societies();
    return new Turn(this.players, this.environment, this.societies, this.relations);
  },
  _get_choices: function () {
    var self = this;
    return this.players.map(function (player, i) {
      var society = self.societies[i];
      if (society.is_alive()) {
        return player.choose(self.environment.json(), society.json(), clone(self.relations)); 
      } else {
        return null;
      }
    });
  },
  /**
  Modifies this turn's environment, according to
  the choices of each player.

  @function
  @private
  */
  _process_choices_on_environment: function () {
    this.choices.modify_environment(this.environment);
  },
  /**
  Modifies this turn's societies, according to
  the choices of each player.

  @function
  @private
  */
  _process_choices_on_societies: function () {
    this.choices.modify_societies(this.societies);
  },
  /**
  Grow resources according to remaining ecology.

  @function
  @private
  */
  _process_state_of_environment: function () {
    this.environment.addResources(this.environment.ecology);
  },
  /**
  Societies consume resources.

  @function
  @private
  */
  _process_state_of_societies: function () {
    this.societies.forEach(function (society) {
      var hunger = 0;
      hunger += society.values.develop; 
      hunger += society.values.expand;
      hunger += -society.values.adapt ;
      society.addResources(-hunger);
    });
  }
};

module.exports = Turn;
