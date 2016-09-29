
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', 
    { preload: preload, create: create, update: update });

function preload() {
    //load all images and assign them names (keys)
    game.load.image('background', 'assets/skybg1.png');
    game.load.image('platforms', 'assets/cloudplatform2.png');
    game.load.image('groundBottom', 'assets/ground.png');
    game.load.image('star', 'assets/diamond2.png');
    game.load.image('diamond', 'assets/diamond.png');
    game.load.image('scorePic', 'assets/scorebg.png');
    game.load.spritesheet('dude', 'assets/kitty2.png', 70, 63);
    game.load.spritesheet('enemy', 'assets/ghost5.png', 44, 40);
    game.load.tilemap('tilemap', 'assets/tiles/tilesmap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tiles/sheet.png');
    // game.load.image('tilesice', 'assets/tiles/sheet2.png');
    // game.load.atlas('lazer', 'assets/laser.png', 'assets/laser.json');

}

var player;
var platforms;
var cursors;
var ground;
var backgroundTile;
var enemies;
var anim;
var back;
var enemyLocX;
var enemyLocY;
var enemyTop;
var enemySet;
var map;
var backgroundLayer;
var groundLayer;


var stars;
var score = 0;
var scoreText;


function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);



    //Add the tilemap and tileset image. The first parameter in addTilesetImage
    //is the name you gave the tilesheet when importing it into Tiled, the second
    //is the key to the asset in Phaser
    map = game.add.tilemap('tilemap');
    map.addTilesetImage('sheet', 'tiles');
    // map.addTilesetImage('Ice', 'tilesice');
 
    //Add both the background and ground layers. We won't be doing anything with the
    //GroundLayer though
    backgroundLayer = map.createLayer('BackgroundLayer');
    groundLayer = map.createLayer('GroundLayer');
 
    //Before you can use the collide function you need to set what tiles can collide
    map.setCollisionBetween(1, 100, true, 'GroundLayer');
 
    //Change the world size to match the size of this layer
    groundLayer.resizeWorld();



    // //set up background and ground layer
    // backgroundTile = game.add.tileSprite(0, 0, 4000, 600, 'background');

    game.world.setBounds(0, 0, 4000, 0);
    //setBounts(0,0,2000, game.height)???
    // cloudground = game.add.tileSprite(0, game.height-70, game.world.width, 70, 'groundBottom');


    // Here we create the ground.
    var ground = game.add.tileSprite(0, game.world.height - 56, game.world.width, 70, 'groundBottom');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(1, 1);

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true; 

    //add ground to the platforms group
    platforms.add(ground);


    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;


    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'platforms');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'platforms');
    ledge.body.immovable = true;

    ledge = platforms.create(700, 200, 'platforms');
    ledge.body.immovable = true;

    ledge = platforms.create(1220, 100, 'platforms');
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 130, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 400;
    player.body.velocity.x = 20;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 20; i++){
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 100, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }


    scorePic = game.add.sprite(12, 12, 'scorePic');

    //  The score
    scoreText = game.add.text(25, 20, 'Score: 0', { fontSize: '20px', fill: '#b978a0' });

    scoreText.fixedToCamera = true;

    game.world.bringToTop(scoreText);

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

    //camera follows player
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    //player not fixed to camera
    player.fixedToCamera = false;  

    // add enemies
    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;

    createEnemies();




}


function update() {
  
    // backgroundTile.tilePosition.x -= 1;

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(enemies, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //Make the sprite collide with the ground layer
    game.physics.arcade.collide(sprite, groundLayer);


    //Make the sprite jump when the up key is pushed
    if(cursors.up.isDown) {
      sprite.body.velocity.y = -500;
    }
 
    
    // else if (game.physics.arcade.overlap(player, enemies)) {
    // player.kill();
    // }





    // if (enemy.body.touching.up == true) {
    //     killEnemy();
    // }

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    //checking if key is pressed, move player accordingly
    if (cursors.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -150;
        player.animations.play('left');
    }
    else if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 150;
        player.animations.play('right');
    }
    else {
        //  Stand still
        player.animations.stop();
        player.frame = 4;
    }

    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -350;
    }

    if (anim.isPlaying) {   
            enemies.x -= .001;
    }
}





function createEnemies() {
    //randomly distribute them thruout level
    for (var i=0; i<12; i++) {
        // enemyLocX = Math.floor((Math.random() * 4000) + 1);
        // enemyLocY = Math.floor((Math.random() * 600) + 1);
        enemy = enemies.create(game.world.randomX, game.world.randomY, 'enemy');
        enemy.body.immovable = false;
        enemy.body.gravity.y = 100;
        enemy.body.bounce.y = 0.1 + Math.random() * 0.2;
        anim = enemy.animations.add('walk', [0, 1], 2, true);
        anim.play('walk');
        // var playerxRounded = 
        // Math.ceil((Math.round(player.x - 35)) / 10) * 10;
        // var playeryRounded = 
        // Math.ceil((Math.round(player.y - 63)) / 10) * 10;
        // var enemyxRounded = 
        // Math.ceil((Math.round(enemy.x)) / 10) * 10;
        // var enemyxRounded = 
        // Math.ceil((Math.round(enemy.y)) / 10) * 10;

        // if (playerxRounded == enemyxRounded && playeryRounded == enemyyRounded) {
        // enemy.kill();
        // }


    }; 

};


function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);
}

function killEnemy (player, enemy) {
    enemy.kill();
    score += 30;
    scoreText.text = 'Score: ' + score;
}


function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
}