var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);
var score = 0;
var platforms;
var player;
var cursors; 
var radis;
var scoreText;



function preload(){
	this.load.image('background','assets/Blue.png',);
	this.load.image('platforms', 'assets/platforms.png');
	this.load.spritesheet('radis', 'assets/radis.png',{frameWidth: 30, frameHeight:38});
	this.load.spritesheet('perso', 'assets/perso.png',{frameWidth: 32, frameHeight:32});
	this.load.spritesheet('fatBird', 'assets/fatBird.png',{frameWidth: 30, frameHeight:30});
	this.load.image('sol','assets/sol.png',);
}



function create(){
	this.add.image(400,300,'background').setScale(20);

	
// Platforme placement et interactions
	platforms = this.physics.add.staticGroup();
	platforms.create(400,600,'sol').refreshBody();
	platforms.create(50,250,'platforms');
	platforms.create(500,250,'platforms');
	platforms.create(600,500,'platforms');
	platforms.create(200,350,'platforms');

//perso	
	player = this.physics.add.sprite(100,450,'perso');
	player.setCollideWorldBounds(true);
	player.setBounce(0.2);
	player.body.setGravityY(000);
	this.physics.add.collider(player,platforms);


	cursors = this.input.keyboard.createCursorKeys();

//animation perso	
	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 3}),
		frameRate: 10,
		repeat: -1
	});
	 
	this.anims.create({
		key:'stop',
		frames: [{key: 'perso', frame:4}],
		frameRate: 20
	});

//radis	
		radis = this.physics.add.group({
		key: 'radis',
		repeat:11,
		setXY: {x:12,y:0,stepX:70}
	});
	
	this.physics.add.collider(radis,platforms);
	this.physics.add.overlap(player,radis,collectRadis,null,this);

//affichage score

	scoreText = this.add.text(16,16, 'score: 0', {fontSize: '32px', fill:'#000'});
	fatBirds = this.physics.add.group();
	this.physics.add.collider(fatBirds,platforms);
	this.physics.add.collider(player,fatBirds, hitfatBirds, null, this);
}


//deplacement 

function update(){
	if(cursors.left.isDown){
		player.anims.play('left', true);
		player.setVelocityX(-300);
		player.setFlipX(false);
	}else if(cursors.right.isDown){
		player.setVelocityX(300);
		player.anims.play('left', true);
		player.setFlipX(true);
	}else{
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}
	
	if(cursors.up.isDown && player.body.touching.down){
		player.setVelocityY(-330);
	} 
	
}

// monstre
function hitfatBirds(player, fatBird){
	this.physics.pause();
	player.setTint(0xff0000);
	player.anims.play('turn');
	gameOver=true;
}


// collecte radis

function collectRadis(player, radi){
	radi.disableBody(true,true);
	score += 10;
	scoreText.setText('score: '+score);
	if(radis.countActive(true)===0){
		radis.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});
		
		var x = (player.x < 400) ? 
			Phaser.Math.Between(400,800):
			Phaser.Math.Between(0,400);

		var fatBirds = fatBirds.create(x, 16, 'fatBird');
		fatBirds.setBounce(1);
		fatBirds.setCollideWorldBounds(true);
		fatBirds.setVelocity(Phaser.Math.Between(-200, 200), 20);
	}
}