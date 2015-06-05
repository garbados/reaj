var _ = require('underscore');

/**
Helper class for processing the choices made
each turn.

@class
@param {array} choices - list of choices made by players of living societies this turn
@param {object} environment - (optional) the environment before this turn
@param {array} societies - (optional) an array of currently-living societies
@param {array} relations - (optional) a 2-dimensional square matrix of relations between societies
*/
function Choices (choices, environment, societies, relations) {
  this.choices = choices;
  this.count = _.countBy(this.choices);
  this.environment = environment;
  this.societies = societies;
  this.relations = relations;
}

/**
Array of the names of all choices.

@constant
*/
Choices.ALL = [
  'conquer',
  'develop',
  'expand',
  'exchange',
  'cooperate',
  'adapt'
];

Choices.prototype = {
  /**
  @todo document this
  @function
  */
  process: function () {
    var self = this;
    this.choices.forEach(function (choice, i) {
      self.societies[i].incValue(choice);
    });
    Choices.ALL.forEach(function (choice) {
      if (self.count[choice])
        self['_' + choice]();
    });
  },
  _conquer: function () {
    var self = this;
    var attackers = this._who_chose('conquer');
    attackers.forEach(function (attacker) {
      var victims = self.societies.filter(function (victim) {
        return (attacker.value('conquer') > victim.value('conquer'));
      });
      // gain resources for every victim
      attacker.addResources(victims.length);
      // victims lose resources and gain hatred
      victims.forEach(function (victim) {
        victim.addResources(-1);
        self.relations[victim.index()][attacker.index()] -= 1;
      });
    });
  },
  _exchange: function () {
    var traders = this._who_chose('exchange');
    var pot = Math.floor(this.environment.resources() / traders.length);
    traders.forEach(function (trader) {
      trader.addResources(pot);
    });
    this.environment.resetResources();
  },
  _expand: function () {
    var self = this;
    var expansionists = self._who_chose('expand');
    this.environment.subLand(expansionists.length);
    expansionists.forEach(function (expansionist) {
      expansionist.addResources(self.environment.land());
    });
  },
  _develop: function () {
    var developers = this._who_chose('develop');
    this.environment.subEcology(developers.length);
    developers.forEach(function (developer) {
      developer.addResources(developer.value('develop') * 2);
    });
    if (this.environment.ecology() < 0) {
      // ecological disaster
      var penalty = this.relations.length;
      this.societies.forEach(function (society) {
        society.addResources(-penalty);
      });
    }
  },
  _cooperate: function () {
    var self = this;
    var collaborators = this._who_chose('cooperate');
    collaborators.forEach(function (collaborator) {
      collaborator.addResources(collaborators.length * 2);
      self.societies.forEach(function (society) {
        self.relations[society.index()][collaborator.index()] += 1;
      });
    });
    // geopolitical disaster
    var penalty = this.relations.length;
    this.societies.forEach(function (society) {
      society.addResources(-penalty);
    });
  },
  _adapt: function () {
    this.environment.addEcology(this._who_chose('adapt').length);
  },
  /**
  Returns a list of societies
  that chose the given value.

  @function
  @param {string} value - the choice to filter by
  @returns {array}
  */
  _who_chose: function (value) {
    var self = this;
    return this.societies.map(function (_, i) {
      return self.choices[i] === value ? self.societies[i] : null;
    }).filter(function (x) { return x; });
  }
};

module.exports = Choices;
