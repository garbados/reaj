var _ = require('underscore');
var basic = require('./basic');

var strategies = {};
_.extend(strategies, basic);
strategies.random = require('./random');

module.exports = strategies;
