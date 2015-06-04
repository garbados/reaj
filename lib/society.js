var _ = require('underscore');
var Choices = require('./choices');

/**
@todo document this
@class
@param {number} index - the index of this society in the list of all societies in the current game
*/
function Society (index) {
  this._dead = false;
  this._index = index;
  this._resources = 10;
  this._values = _.countBy(Choices.ALL);
}

Society.prototype = {
  /**
  @todo document this
  @function
  */
  index: function () {
    return this._index;
  },
  /**
  @todo document this
  @function
  */
  values: function () {
    return this._values;
  },
  /**
  @todo document this
  @function
  */
  value: function (name) {
    return this._values[name];
  },
  /**
  @todo document this
  @function
  */
  incValue: function (name) {
    this._values[name] += 1;
  },
  /**
  @todo document this
  @function
  */
  json: function () {
    return {
      resources: this.resources(),
      values: this.values(),
      index: this._index
    };
  },
  /**
  @todo document this
  @function
  */
  resources: function () {
    return this._resources;
  },
  /**
  @todo document this
  @function
  */
  addResources: function (n) {
    this._resources += n;
    if (this._resources <= 0) {
      this._dead = true;
    }
  },
  /**
  @todo document this
  @function
  */
  isAlive: function () {
    return !this._dead;
  }
};

module.exports = Society;
