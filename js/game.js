
var Game = {};

Game.preload = function(){
  Game.scene = this; // Handy reference to the scene (alternative to `this` binding)
    this.load.image('tileset', 'assets/gridtiles.png');
    this.load.tilemapTiledJSON('map', 'assets/finalMap.json');
    this.load.image('ash', 'assets/ash.png');

};

Game.create = function(){

    Game.camera = this.cameras.main;
    Game.camera.setBounds(0, 0, 20*32, 20*32);

    var ash = this.add.image(32,32,'ash');
    ash.setDepth(1);

    ash.setOrigin(0,0.5);

    Game.camera.startFollow(ash);
    Game.player = ash;

    // Display map
    Game.map = Game.scene.make.tilemap({ key: 'map'});
    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    var tiles = Game.map.addTilesetImage('tiles', 'tileset');
    Game.map.createStaticLayer(0, tiles, 0,0);

};

Game.update = function(){

};
