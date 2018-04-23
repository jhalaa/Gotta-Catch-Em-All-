/* globals describe, it, expect, dummy */
var test = true
game = require('../js/game.js')

describe('Basic testing for game.js', function () {
    it('It sould have 5 distinct pokemon', function () {
      // console.log(game.Game)
      game.Game.generatePokemonIds()
      expect(game.pokemonIds.length).toEqual(5);
    });

    it('It sould have 5 distinct pokemon positions', function () {
        game.Game.generatePokemonIds()
        expect(game.pokemonPositions.length).toEqual(5);
    });

    it('It sould have 5 distinct pokemon positions', function () {
        game.Game.generatePokemonIds()
        expect(game.pokemonPositions.length).toEqual(5);
    });

});
