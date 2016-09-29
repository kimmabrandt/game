
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', 
    { preload: preload, create: create, update: update });

function preload() {
    //load all images and assign them names (keys)
    game.load.image('firstaid', 'assets/firstaid.png');
    game.load.image('background', 'assets/skybg1.png');
    game.load.image('clouds', 'assets/cloudplatform2.png');
    game.load.image('cloudsPink', 'assets/cloudplatform3.png');
    game.load.image('groundBottom', 'assets/ground.png');
    game.load.image('star', 'assets/diamond2.png');
    game.load.image('diamond', 'assets/diamond.png');
    game.load.image('scorePic', 'assets/scorebg.png');
    game.load.image('floor1', 'images/floor1.jpg');
    game.load.image('floor2', 'images/floor2.jpg');
    game.load.image('floor3', 'images/floor3.jpg');
    game.load.image('floor4', 'images/floor4.jpg');
    game.load.image('pink2w', 'images/pink2w.png');
    game.load.image('pink3w', 'images/pink3w.png');
    game.load.image('pink4w', 'images/pink4w.png');
    game.load.image('pink5w', 'images/pink5w.png');
    game.load.image('pink9w', 'images/pink9w.png');
    game.load.image('pinkedge4w', 'images/pinkedge4w.png');
    game.load.image('pinksmall3w', 'images/pinksmall3w.png');
    game.load.image('sprinkles3w', 'images/sprinkles3w.png');
    game.load.image('sprinkles4w', 'images/sprinkles4w.png');
    game.load.image('candycolumn4t', 'images/candycolumn4t.png');
    game.load.image('greencandycolumn3t', 'images/greencandycolumn3t.png');
    game.load.image('water1', 'images/water.png');
    game.load.image('spikes1', 'images/spikes6w.png');
    game.load.image('candy1', 'images/platform1candy.png');
    game.load.image('platform2candy', 'images/platform2candy.png');
    game.load.image('candy2', 'images/candycane2t.png');
    game.load.image('greenloli', 'images/greenloli.png');
    game.load.image('finishcandy', 'images/finishcandy.png');
    game.load.image('bullet', 'assets/bullet3.png');
    game.load.image('gameover', 'assets/gameover.png');
    game.load.image('youwin', 'assets/youwin.png');
    game.load.spritesheet('dude', 'assets/kitty3.png', 70, 55);
    game.load.spritesheet('enemy', 'assets/ghost5.png', 44, 40);
    // game.load.atlas('lazer', 'assets/laser.png', 'assets/laser.json');

}

var player;
var platforms;
var dieAreas;
var cursors;
var ground;
var backgroundTile;
var bgElements;
var bgClouds;
var enemies;
var anim;
var back;
var enemyLocX;
var enemyLocY;
var enemyTop;
var enemySet;
var gameOver;
var youWin;
var gameText;

var bullets;
var bulletTime = 0;
var fireButton;


var stars;
var score = 0;
var scoreText;


var cursors = null;
var speed = 300;

function create() {

    // Enable physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Set repeating background
    backgroundTile = game.add.tileSprite(0, 0, 4000, 600, 'background');
    // backgroundTile.scale.setTo(1.3, 1.4);

    //Game boundary
    game.world.setBounds(0, 0, 4000, 0);
    //setBounts(0,0,2000, game.height)???

    // Platforms Group
    platforms = game.add.group();

    //  We will enable physics for any objects in group
    platforms.enableBody = true; 

    //  Create the floor platforms in platforms group
    var floor = platforms.create(0, 506, 'floor1');
    floor.body.immovable = true;

    floor = platforms.create(720, 506, 'floor2');
    floor.body.immovable = true;

    floor = platforms.create(1437, 506, 'floor3');
    floor.body.immovable = true;

    floor = platforms.create(2862, 506, 'floor4');
    floor.body.immovable = true;

    ledge = platforms.create(186, 458, 'pink5w');
    ledge.body.immovable = true;

    ledge = platforms.create(470, 366, 'sprinkles4w');
    ledge.body.immovable = true;

    ledge = platforms.create(795, 270, 'pink3w');
    ledge.body.immovable = true;

    ledge = platforms.create(928, 398, 'pinksmall3w');
    ledge.body.immovable = true;

    ledge = platforms.create(1052, 206, 'pink4w');
    ledge.body.immovable = true;

    ledge = platforms.create(1270, 412, 'sprinkles3w');
    ledge.body.immovable = true;

    ledge = platforms.create(1928, 380, 'pink5w');
    ledge.body.immovable = true;

    ledge = platforms.create(2226, 285, 'pinkedge4w');
    ledge.body.immovable = true;

    ledge = platforms.create(2468, 198, 'pinkedge4w');
    ledge.body.immovable = true;

    ledge = platforms.create(2717, 112, 'pink2w');
    ledge.body.immovable = true;

    ledge = platforms.create(3522, 420, 'pink9w');
    ledge.body.immovable = true;

    ledge = platforms.create(1100, 315, 'candycolumn4t');
    ledge.body.immovable = true;

    ledge = platforms.create(2862, 315, 'candycolumn4t');
    ledge.body.immovable = true;

    ledge = platforms.create(2920, 362, 'greencandycolumn3t');
    ledge.body.immovable = true;



    //dieAreas group - sections that kill player ie water, spikes, etc
    dieAreas = game.add.group();
    dieAreas.enableBody = true;

    var water = dieAreas.create(480, 526, 'water1');
    water.body.immovable = true;

    var spikes = dieAreas.create(1149, 526, 'spikes1');
    spikes.body.immovable = true;

    // Here we create the ground.
    var ground = game.add.tileSprite(2012, game.world.height - 56, game.world.width, 70, 'groundBottom');
    ground.scale.setTo(1, 1);
    dieAreas.add(ground);
    ground.body.immovable = true;


    //Background elements
    bgElements = game.add.group();
    var candy = bgElements.create(188, 316, 'candy1');
    candy = bgElements.create(798, 175, 'candy2');
    candy = bgElements.create(1980, 285, 'platform2candy');
    candy = bgElements.create(3390, 381, 'greenloli');
    candy = bgElements.create(3525, 229, 'finishcandy');


    // Background Clouds
    bgClouds = game.add.group();
    var clouds = bgClouds.create(-150, 250, 'cloudsPink');
    bgClouds.scale.setTo(.8, 1);
    bgClouds.alpha = .8;
    clouds = bgClouds.create(400, 100, 'cloudsPink');
    clouds = bgClouds.create(700, 200, 'cloudsPink');
    clouds = bgClouds.create(1220, 100, 'cloudsPink');

    // Game text
    gameText = game.add.group();





    // The player and its settings
    player = game.add.sprite(32, game.world.height - 180, 'dude');
    player.anchor.setTo(0.5, 1);

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 400;
    player.body.velocity.x = 30;
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
    scorePic.fixedToCamera = true;

    //  The score
    // scoreText = game.add.text(25, 20, 'Score: 0', { font: '40px VT323', fill: '#b978a0' });

    scoreText = game.add.text(130, 15, '0', { font: '30px courier', fill: '#ffffff' });
    scoreText.fixedToCamera = true;

    game.world.bringToTop(scoreText);
    game.world.bringToTop(platforms);

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

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}


function update() {
  
    backgroundTile.tilePosition.x -= .5;

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(enemies, platforms);

    //  Checks if player overlap stars
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Checks if player falls into die areas
    if (game.physics.arcade.overlap(player, dieAreas) == true) {
        killPlayer();
    }

    //  Checks if enemy hits player
    if (game.physics.arcade.overlap(player, enemies) == true) {
        killPlayer();
    }

    if(fireButton.isDown) {
    fireBullet();
    }

    // Check if bullets overlap enemy
    game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this);
    // Check if
    game.physics.arcade.overlap(player, ground, killPlayer, null, this);




    enemies.forEach(function(e) {
        if (e && e.alive) {
            if (e.body.y + e.body.height > 580) {
                enemyFall(e);
            }
        }
    })



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
        player.body.velocity.y = -450;
    }

    if (anim.isPlaying) {   
            enemies.x -= .001;
    }

    if (player.x > 3738) {
        youWin = gameText.create(200, 130, 'youwin');
        youWin.fixedToCamera = true;
        game.world.bringToTop(gameText);
    }

}



var enemyXLoc = null;

function createEnemies() {
    //randomly distribute them thruout level
    for (var i=0; i<12; i++) {
        if (game.world.randomX > 250) {
            enemyXLoc = game.world.randomX;
        }
        else {
            enemyXLoc = game.world.randomX + 500;
        }


        enemy = enemies.create(enemyXLoc, 100, 'enemy');
        enemy.body.bounce.set(1);
        enemy.body.velocity.x = -100;
        enemy.body.collideWorldBounds = true;
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

function killPlayer () {
    player.kill();
    
    gameOver = gameText.create(180, 140, 'gameover');
    gameOver.fixedToCamera = true;
    game.world.bringToTop(gameText);


}


function enemyFall (e) {
    e.destroy();
}


function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = score;
};


function fireBullet() {
    if(game.time.now > bulletTime) {
        bullet = bullets.getFirstExists(false);

        if (bullet) {
            bullet.reset(player.x, player.y - 25); //add a few if its not centered
            
            if (cursors.left.isDown) {
                bullet.body.velocity.x = -400;
            }
            else {
                bullet.body.velocity.x = 400;
            }
            bulletTime = game.time.now + 200;
        }
    }
}

//Kill enemy if bullet hits
function collisionHandler(bullet, enemy) {
    bullet.kill();
    enemy.kill();
    score += 30;
    scoreText.text = score;

};


