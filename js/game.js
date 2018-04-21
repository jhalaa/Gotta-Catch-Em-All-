
var Game = {};
var pokemonIds =[];
var pokemonPositions =[];

Game.preload = function(){
    Game.scene = this;
    this.load.image('tileset', 'assets/gridtiles.png');
    this.load.tilemapTiledJSON('map', 'assets/finalMap.json');
    this.load.image('ash', 'assets/ash.png');

    Game.generatePokemonIds();

    //5 random pokemon
    this.load.image('pokemon1','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+pokemonIds[0]+'.png');
    // this.load.image('pokemon2','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+pokemonIds[1]+'.png');
    // this.load.image('pokemon3','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+pokemonIds[2]+'.png');
    // this.load.image('pokemon4','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+pokemonIds[3]+'.png');
    // this.load.image('pokemon5','https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+pokemonIds[4]+'.png');
};

Game.create = function(){

    this.input.on('pointerup',Game.handleClick);

    Game.camera = this.cameras.main;
    // top-left,top-right, width-height
    Game.camera.setBounds(0, 0, 44*32, 22*32);

    // adds an image to the scene and postions it at 32*32,ie,the first block
    var ash = this.add.image(32,32,'ash');
    // var pokemon2 = this.add.image(32,32,'pokemon2');
    // var pokemon3 = this.add.image(32,32,'pokemon3');
    // var pokemon4 = this.add.image(32,32,'pokemon4');
    // var pokemon5 = this.add.image(32,32,'pokemon5');

    //make the image come on top of the scene-> similar to z index
    ash.setDepth(1);
    // pokemon2.setDepth(1);
    // pokemon3.setDepth(1);
    // pokemon4.setDepth(1);
    // pokemon5.setDepth(1);


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
    Game.generatePokemonPosition(acceptableTiles);
    var pokemon1 = this.add.image(tileset.texCoordinates[pokemonPositions[0]].x -32,tileset.texCoordinates[pokemonPositions[0]].y-32,'pokemon1');
    pokemon1.setDepth(1);
    pokemon1.setOrigin(0,0);
};

Game.update = function(){
  var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

    // Rounds down to nearest tile
    var pointerTileX = Game.map.worldToTileX(worldPoint.x);
    var pointerTileY = Game.map.worldToTileY(worldPoint.y);
    Game.marker.x = Game.map.tileToWorldX(pointerTileX);
    Game.marker.y = Game.map.tileToWorldY(pointerTileY);
    Game.marker.setVisible(!Game.checkCollision(pointerTileX,pointerTileY));
};

Game.checkCollision = function(x,y){
    var tile = Game.map.getTileAt(x, y);
    return tile.properties.collide == true;
};


// Helper function
// Returns the id of the tile given x and y coordinates
Game.getTileID = function(x,y){
    var tile = Game.map.getTileAt(x, y);
    return tile.index;
};

Game.generatePokemonIds = function(){
    while(pokemonIds.length<5){
      var id = Math.floor(Math.random() * 87);
      if(!pokemonIds.includes(id))
        pokemonIds.push(id);
    }
};

Game.generatePokemonPosition = function(acceptableTiles){
    while(pokemonPositions.length<5){
      var tile = acceptableTiles[Math.floor(Math.random() * acceptableTiles.length)]
      if(!pokemonPositions.includes(tile))
        pokemonPositions.push(tile);
    }
};

Game.handleClick = function(pointer){
    var x = Game.camera.scrollX + pointer.x;
    var y = Game.camera.scrollY + pointer.y;
    var toX = Math.floor(x/32);
    var toY = Math.floor(y/32);
    var fromX = Math.floor(Game.player.x/32);
    var fromY = Math.floor(Game.player.y/32);
    console.log('going from ('+fromX+','+fromY+') to ('+toX+','+toY+')');

    Game.finder.findPath(fromX, fromY, toX, toY, function( path ) {
        if (path === null) {
            console.warn("Path was not found.");
        } else {
            console.log(path);
            Game.moveCharacter(path);
        }
    });
    Game.finder.calculate(); // don't forget, otherwise nothing happens
};

Game.moveCharacter = function(path){
    // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
    var tweens = [];
    for(var i = 0; i < path.length-1; i++){
        var ex = path[i+1].x;
        var ey = path[i+1].y;
        tweens.push({
            targets: Game.player,
            x: {value: ex*Game.map.tileWidth, duration: 200},
            y: {value: ey*Game.map.tileHeight, duration: 200}
        });
    }

    Game.scene.tweens.timeline({
        tweens: tweens
    });
};
