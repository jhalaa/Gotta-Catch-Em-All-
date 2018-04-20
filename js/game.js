
var Game = {};

Game.preload = function(){
    Game.scene = this;
    this.load.image('tileset', 'assets/gridtiles.png');
    this.load.tilemapTiledJSON('map', 'assets/finalMap.json');
    this.load.image('ash', 'assets/ash.png');
};

Game.create = function(){

    Game.camera = this.cameras.main;
    // top-left,top-right, width-height
    Game.camera.setBounds(0, 0, 44*32, 22*32);

    // adds an image to the scene and postions it at 32*32,ie,the first block
    var ash = this.add.image(32,32,'ash');
    //make the image come on top of the scene-> similar to z index
    ash.setDepth(1);

    // setting the origin of the sprite
    ash.setOrigin(0,0.5);

    Game.camera.startFollow(ash);
    Game.player = ash;

    // Display map
    Game.map = Game.scene.make.tilemap({ key: 'map'});
    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    var tiles = Game.map.addTilesetImage('tiles', 'tileset');
    // parameters are layer id, tileset, x and y position
    Game.map.createStaticLayer(0, tiles, 0,0);

    // Marker that will follow the mouse
    Game.marker = this.add.graphics();
    Game.marker.lineStyle(3, 0xffffff, 1);
    Game.marker.strokeRect(0, 0, Game.map.tileWidth, Game.map.tileHeight);

    // ### Pathfinding stuff ###
    // Initializing the pathfinder
    Game.finder = new EasyStar.js();

    // We create the 2D array representing all the tiles of our map
    var grid = [];
    for(var y = 0; y < Game.map.height; y++){
        var col = [];
        for(var x = 0; x < Game.map.width; x++){
            // In each cell we store the ID of the tile, which corresponds
            // to its index in the tileset of the map ("ID" field in Tiled)
            col.push(Game.getTileID(x,y));
        }
        grid.push(col);
    }
    Game.finder.setGrid(grid);

    // get the list of acceptable tiles
    var tileset = Game.map.tilesets[0];
    var properties = tileset.tileProperties;
    var acceptableTiles = [];

    // We need to list all the tile IDs that can be walked on. Let's iterate over all of them
    // and see what properties have been entered in Tiled.
    for(var i = tileset.firstgid-1; i < tiles.total; i++){ // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
        if(!properties.hasOwnProperty(i)) {
            // If there is no property indicated at all, it means it's a walkable tile
            acceptableTiles.push(i+1);
            continue;
        }
        if(!properties[i].collide) acceptableTiles.push(i+1);
        if(properties[i].cost) Game.finder.setTileCost(i+1, properties[i].cost); // If there is a cost attached to the tile, let's register it
    }
    Game.finder.setAcceptableTiles(acceptableTiles);
};

Game.update = function(){

};

// Helper function
// Returns the id of the tile given x and y coordinates
Game.getTileID = function(x,y){
    var tile = Game.map.getTileAt(x, y);
    return tile.index;
};
