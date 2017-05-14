const assert = require('assert');
const hex = require("./public/javascripts/hex.js");
const game = require("./public/javascripts/game.js");
const heroes = require("./public/javascripts/heroes.js");
const map1 = require("./public/javascripts/maps/map1.js");
const characters = require("./public/javascripts/characters.js");
const index = require("./public/javascripts/index.js");
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
