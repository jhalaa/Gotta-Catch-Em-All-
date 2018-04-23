/* globals describe, it, expect, dummy */
var test = true
game = require('../js/game.js')

describe('Basic testing for game.js', function () {
    it('It should have 5 distinct pokemon', function () {
      // console.log(game.Game)
      game.Game.generatePokemonIds()
      expect(game.pokemonIds.length).toEqual(5);
    });

    it('It should have 5 distinct pokemon positions', function () {
        game.Game.generatePokemonIds()
        expect(game.pokemonPositions.length).toEqual(5);
    });

    it('It should have 5 distinct pokemon positions', function () {
        game.Game.generatePokemonIds()
        expect(game.pokemonPositions.length).toEqual(5);
    });

    it('It should have create function', function () {
        expect(game.Game.create).not.toBe(null);
    });

    it('It should have preload function', function () {
        expect(game.Game.preload).not.toBe(null);
    });

    it('It should have move function', function () {
        expect(game.Game.moveCharacter).not.toBe(null);
    });

    it('It should have click function', function () {
        expect(game.Game.handleClick).not.toBe(null);
    });
});
