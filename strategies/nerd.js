var _ = require('underscore');
var fs = require('fs');
var util = require('util');
var lib = require('../lib');
var Player = lib.Player;

/*

Explicitly calculate the optimal choice using best response correspondences

@link http://en.wikipedia.org/wiki/Best_response#Best_response_correspondence
@class
*/

function CournotPlayer () {
  this.name = 'nerd';
  this.turn = 0;
  this.last_turn_land = 0;
  this.last_turn_ecology = 0;
  return Player.call(this);
}

util.inherits(CournotPlayer, Player);

CournotPlayer.prototype.choose = function (environment, society, relations) {
  // iterate turn count
  this.turn++;
  // attach to self so payoff estimators have consistent access
  this.environment = environment;
  this.society = society;
  this.relations = relations;
  var action = this._get_best_action();
  // cleanup
  this.last_turn_ecology = this.environment.ecology;
  this.last_turn_land = this.environment.land;
  return action;
};

CournotPlayer.prototype._get_best_action = function () {
  var self = this;
  var action = _.chain(this.payoffs)
    .pairs()
    .max(function (pair) {
      return pair[1].call(self);
    })
    .value();
  return action[0];
};

CournotPlayer.prototype.payoffs = {
  conquer: function () {
    var self = this;
    // estimate who has less conquer than you
    var conquerers = this.relations[this.society.index].filter(function (relation) {
      return relation <= self.society.values.conquer;
    });
    return this.relations.length - conquerers.length;
  },
  expand: function () {
    // estimate change since last turn
    var delta = this.last_turn_land - this.environment.land;
    var payoff = this.environment.land - delta;
    return payoff;
  },
  exchange: function () {
    // estimate how many others will choose exchange
    // TODO better reasoning than "assume nobody"?
    return this.environment.resources;
  },
  develop: function () {
    // TODO estimate likelihood others will choose develop
    var disaster_impending = (this.environment.ecology - this.last_turn_ecology) > this.environment.ecology;
    if (disaster_impending) {
      return this.society.values.develop - this.relations.length;
    } else {
      return this.society.values.develop;
    }
  },
  cooperate: function () {
    var self = this;
    var collaborators = this.relations[this.society.index].filter(function (relation) {
      return relation >= self.society.values.cooperate;
    });
    if (collaborators.length) {
      return 2 * (collaborators.length + 1);
    } else {
      return 2 + this.relations.length;
    }
  },
  adapt: function () {
    var disaster_impending = (this.environment.ecology - this.last_turn_ecology) > this.environment.ecology;
    var reward_over_time = (100 - this.turn) * 0.2; // modify by interest value
    if (disaster_impending) {
      // estimate reward for averting disaster
      return reward_over_time + this.relations.length;
    } else {
      return reward_over_time;
    }
  }
};

module.exports = CournotPlayer;
