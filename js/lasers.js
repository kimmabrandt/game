
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', 
    { preload: preload, create: create, update: update });

function preload() {
    //load all images and assign them names (keys)
    game.load.image('background', 'assets/starbg.png');
    game.load.image('platforms', 'assets/cloudplatform2.png');
    game.load.image('groundBottom', 'assets/ground.png');
    game.load.image('star', 'assets/donutnew.png');
    game.load.spritesheet('dude', 'assets/kitty2.png', 70, 63);
    game.load.spritesheet('enemy', 'assets/baddie.png', 32, 32);
    game.load.atlas('lazer', 'assets/laser.png', 'assets/laser.json');

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
var lazers;
var fireButton;
var bulletTime = 0;
var frameTime = 0;
var frames;
var prevCamX = 0;

var stars;
var score = 0;
var scoreText;


function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //set up background and ground layer
    backgroundTile = game.add.tileSprite(0, 0, 4000, 600, 'background');

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
    player.body.gravity.y = 300;
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

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#b978a0' });

    scoreText.fixedToCamera = true;

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //camera follows player
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    //player not fixed to camera
    player.fixedToCamera = false;  

    //lazers
    lazers = game.add.group();

    // add enemies
    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;

    createEnemies();

}


function update() {
    frames = Phaser.Animation.generateFrameNames('frame', 2, 30, '', 2);
    frames.unshift('frame02');

    backgroundTile.tilePosition.x -= 1;

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(enemies, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

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
    if (fireButton.isDown)
    {
        fireBullet();
    }
    lazers.forEachAlive(updateBullets, this);


    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -350;
    }

    if (anim.isPlaying) {   
            enemies.x -= .001;
    }
}


function updateBullets (lazer) {

    if (lazer.animations.frameName !== 'frame30') {
        lazer.animations.next();
    }
    else {
        if (lazer.scale.x === 1) {
            lazer.x += 16;

            if (lazer.x > (game.camera.view.right - 224)) {
                lazer.kill();
            }
        }
        else {
            lazer.x -= 16;

            if (lazer.x < (game.camera.view.left - 224)) {
                lazer.kill();
            }
        }
    }
}

function fireBullet () {

    if (game.time.now > bulletTime) {
        //  Grab the first bullet we can from the pool
        lazer = lazers.getFirstDead(true, player.x + 24 * player.scale.x, player.y + 8, 'lazer');

        lazer.animations.add('fire', frames, 60);
        lazer.animations.frameName = 'frame02';

        lazer.scale.x = player.scale.x;

        if (lazer.scale.x === 1) {
            // lazer.anchor.x = 1;
        }
        else {
            // lazer.anchor.x = 0;
        }
        //  Lazers start out with a width of 96 and expand over time
        // lazer.crop(new Phaser.Rectangle(244-96, 0, 96, 2), true);
        bulletTime = game.time.now + 250;
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

    }; 
};


function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);
}


function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
}