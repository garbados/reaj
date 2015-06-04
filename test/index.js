var lib;
if (process.env.COVERAGE)
  lib = require('../lib-cov');
else
  lib = require('../lib');

describe('reaj', function () {
  describe('environment', function () {});
  describe('society', function () {});
  describe('choices', function () {});
  describe('player', function () {});
  describe('turn', function () {});
  describe('game', function () {});
  describe('tournament', function () {});
});
