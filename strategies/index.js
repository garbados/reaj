var _ = require('underscore');
var basic = require('./basic');

var strategies = {};
_.extend(strategies, basic);
strategies.random = require('./random');
// strategies.brain = require('./brain');
strategies.reinforcements = require('./reinforcements');
strategies.nerd = require('./nerd');

module.exports = strategies;
