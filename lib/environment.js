/**
@todo document this
@class
*/
function Environment () {
  this._land = 10;
  this._ecology = 10;
  this._resources = this._ecology;
}

Environment.prototype = {
  /**
  @todo document this
  @function
  */
  json: function () {
    return {
      land: this._land,
      ecology: this._ecology,
      resources: this._resources
    };
  },
  /**
  @todo document this
  @function
  */
  land: function () {
    return this._land;
  },
  /**
  @todo document this
  @function
  */
  subLand: function (n) {
    if (n > this._land)
      this._land = 0;
    else
      this._land -= n;
  },
  /**
  @todo document this
  @function
  */
  ecology: function () {
    return this._ecology;
  },
  /**
  @todo document this
  @function
  */
  subEcology: function (n) {
    this._ecology -= n;
  },
  /**
  @todo document this
  @function
  */
  addEcology: function (n) {
    this._ecology += n;
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
  },
  /**
  @todo document this
  @function
  */
  resetResources: function () {
    this._resources = 0;
  }
};

module.exports = Environment;
