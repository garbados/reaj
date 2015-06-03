var _ = require('underscore');

/**
Helper class for processing the choices made
each turn.

@class
@param {array} choices - list of choices made by players this turn
*/
function Choices (choices) {
  this.choices = choices;
  this.count = _.countBy(this.choices);
}

Choices.prototype = {
  /**
  Modifies the given `environment` object
  to reflect the effects of this turn's choices.

  @function
  @param {object} environment - the current environment
  */
  modify_environment: function (environment) { // TODO },
  /**
  Modifies each society in the given array
  to reflect the effects of this turn's choices.

  @function
  @param {array} societies - a list of society objects
  */
  modify_societies: function (societies) { // TODO }
};

module.exports = Choices;
