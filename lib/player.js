/**
Abstract base class
for player strategies.

@class
@interface
*/
function Player () {}

Player.prototype = {
  /**
  Given the current environment, the player's society,
  and a matrix of relationships between all societies,
  the player should return their choice for the turn.

  @function
  @abstract
  @param {object} environment - the current state of the shared environment
  @param {object} society - the player's society
  @param {array} relations - a 2-dimensional square matrix representing dispositions between societies
  @returns {string} a choice, ex. "conquer" or "adapt"
  */
  choose: function (environment, society, relations) {
    throw new Error("Not Implemented");
  }
};

module.exports = Player;
