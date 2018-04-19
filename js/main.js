var config = {
    type: Phaser.AUTO,
    width: 10000,
    height: 700,
    parent: 'game',
    scene: [Game]
};

var game = new Phaser.Game(config);
