var assert = require('assert');
var lib;
if (process.env.COVERAGE)
  lib = require('../lib-cov');
else
  lib = require('../lib');

var strategies = require('../strategies');
var PLAYERS = [];
Object.keys(strategies).forEach(function (key) {
  // don't add the human player
  if (key !== 'human')
    PLAYERS.push(strategies[key]);
});

describe('reaj', function () {
  describe('environment', function () {
    before(function () {
      this.environment = new lib.Environment();
    });

    it('should have getters for attributes', function () {
      var land = this.environment.land();
      var ecology = this.environment.ecology();
      var resources = this.environment.resources();
      [land, ecology, resources].forEach(function (x) {
        assert.equal(typeof x, 'number');
      });
    });

    it('should have setters for attributes', function () {
      var old_land = this.environment.land();
      this.environment.subLand(1);
      assert.equal(old_land - 1, this.environment.land());
      var old_ecology = this.environment.ecology();
      this.environment.subEcology(1);
      assert.equal(old_ecology - 1, this.environment.ecology());
      var old_resources = this.environment.resources();
      this.environment.addResources(old_ecology);
      assert.equal(old_resources + old_ecology, this.environment.resources());
      this.environment.resetResources();
      assert.equal(this.environment.resources(), 0);
    });

    it('should serialize to a primitive object', function () {
      var json = this.environment.json();
      assert.equal(json.land, this.environment.land());
      assert(!(json instanceof lib.Environment));
    });
  });

  describe('society', function () {
    before(function () {
      this.society = new lib.Society(0);
    });

    it('should have getters for attributes', function () {
      // TODO
    });

    it('should have getters for attributes', function () {
      // TODO
    });

    it('should serialize to a primitive object', function () {
      // TODO
    });

    it("should know when it's dead", function () {
      var is_alive = this.society.isAlive();
      assert(is_alive);
      this.society.addResources(this.society.resources() * -2);
      is_alive = this.society.isAlive();
      assert.equal(is_alive, false);
    });
  });

  describe('choices', function () { /* TODO */ });

  describe('player', function () {
    before(function () {
      this.player = new lib.Player();
    });

    it('should throw errors if used and not subclassed', function () {
      assert.throws(this.player.choose, Error);
    });
  });

  describe('turn', function () {
    before(function () {
      // initialize the players
      // because normally the game itself would
      var player_objects = PLAYERS.map(function (P) {
        return new P();
      });
      this.turn = new lib.Turn(player_objects);
    });

    it('should process the consequences of this turn and return the next', function () {
      var next_turn = this.turn.process();
      assert(next_turn instanceof lib.Turn);
    });
  });

  describe('game', function () {
    before(function () {
      this.game = new lib.Game(PLAYERS);
    });

    it('should play a game and report statistics such as winners', function () {
      var outcome = this.game.play();
      assert('history' in outcome);
      assert('winners' in outcome);
    });
  });

  describe('tournament', function () {
    before(function () {
      this.rounds = 3;
      this.appearances = 2;
      this.tournament = new lib.Tournament(PLAYERS, this.rounds, this.appearances);
    });

    it('should play a tournament', function () {
      var results = this.tournament.play();
      // a tournament without players will return an empty array
      if (PLAYERS.length)
        assert.equal(results.length, this.rounds);
      else
        assert.equal(results.length, 0);
    });
  });
});
