////////////////////// GAME

var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");

const GAME = 1;
const OVER = 2;
const PAUSE = 3;
const NOT_STARTED = 4;

var game = {
    width : canvas.width,
    height : canvas.height,
	gameOver : false,
	state : NOT_STARTED
}

function updateGame() {
	switch(game.state) {
		case GAME:
			updateOngoingGame();
			break;
		case NOT_STARTED:
			updateStartNewGameAction();
			break;
		case OVER:
			updateStartNewGameAction();
			break;
	}
}

function updateOngoingGame() {
	updateAction();
	updateStars();
	updateEnemies();
	updatePlayer();
	updateEnemyBullets();
	updatePlayerBullets();
}

function updateAction() {
	if (37 in keysDown) {
        movePlayerLeft();
    }
	if (39 in keysDown) {
        movePlayerRight();
    }
	if (38 in keysDown) {
		movePlayerUp();
	}
	if (40 in keysDown) {
		movePlayerDown();
	}
	if (32 in keysDown) {
		playerShoot();
	}
}

function updateStartNewGameAction() {
	if (32 in keysDown) {
		game.state = GAME
		player = createPlayer();

		enemyBullets = [];
		enemies = [];

		createSimpleEnemiesGroup();
	}
}

function drawGame() {
	context.fillStyle = '#000000';
	context.fillRect(0, 0, game.width, game.height);
	
	if (game.state != NOT_STARTED) {
		drawOngoingGame();
	}
	
	switch(game.state) {
		case OVER:
			drawGameOver();
			break;
		case PAUSE:
			drawPausedGame();
			break;

		case NOT_STARTED:
			drawGameNotStarted();
			break;
	}
}

function drawOngoingGame() {
	drawStars();
	drawEnemies();
	drawPlayer();
	drawEnemyBullets();
	drawPlayerBullets();
	drawScore();
	drawLifeLeft();
}

function drawScore() {
	context.fillStyle = '#ffffff';
	context.font = "20px Arial";
	context.fillText("Score: " + player.score, 10, 20);
}

var heartImage = new Image();
heartImage.src = 'img/heart.png';

function drawLifeLeft() {
	context.fillStyle = "#ffffff";
	context.font = "20px Arial";
	context.fillText("x" + player.life, 250, 20);
	context.drawImage(heartImage, 220, 5, 20, 20);
}

function drawGameOver() {
	context.fillStyle = '#ffffff';
	context.font = "30px Arial";
	context.fillText("Game over with score: " + player.score, game.width / 2 - 130, game.height / 2);
}

function drawPausedGame() {
	context.fillStyle = '#ffffff';
	context.font = "30px Arial";
	context.fillText("Press P to unpause game!", game.width / 2 - 140, game.height / 2);
}

function drawGameNotStarted() {
	context.fillStyle = '#ffffff';
	context.font = "30px Arial";
	context.fillText("Press SPACE to start game!", game.width / 2 - 130, game.height / 2);
}

////////////////// STARS

var stars = []

for (var i = 0; i < 150; i++) {
	stars.push(createRandomStar());
}

function createRandomStar() {
	return {
		speed : Math.floor((Math.random() * 4) + 1),
		posX : Math.floor((Math.random() * game.width) + 1),
		posY : Math.floor((Math.random() * game.height) * -1) ,
		radius : Math.floor((Math.random() * 3) + 1)
	}
}

function updateStars() {
	for (var i = 0; i < stars.length; i++) {
		var star = stars[i];
		star.posY += star.speed;
		if (star.posY > game.height) {
			stars[i] = createRandomStar();
		}
	}
}

function drawStars() {
	for (var i = 0; i < stars.length; i++) {
		var star = stars[i];
		context.beginPath();
		context.arc(star.posX, star.posY, star.radius, 0, 2 * Math.PI);
		context.fillStyle = '#ffffff';
		context.fill();
		context.lineWidth = 0;
		context.stroke();
	}
}

////////////////// ENEMIES

var enemyImage = new Image();
enemyImage.src = 'img/enemy1.png';

var enemyTankImage = new Image();
enemyTankImage.src = 'img/enemy2.png';

var enemies = [];

function createSimpleEnemiesGroup(enemyCreateFunction) {
	for (var i = 0; i < 5; i++) {
		var enemy = enemyCreateFunction(((game.width - 20) / 5) * i + 20, -80, 120);
		enemies.push(enemy);
	}
}

createSimpleEnemiesGroup(createSimpleEnemy);

function createSimpleEnemy(posXX, posYY, distance) {
	return {
		life : 1,
		damage : 1,
		speed : 1,
		bulletSpeed : 1,
		width : 80,
		height : 80,
		image : enemyImage,
		posX : posXX,
		posY : posYY,
		distanceToMove : distance,
		alive : true,
		shootTicks : Math.floor((Math.random() * 1000) + 500),
		killPoints : 50
	};
}

function createFastShooterEnemy(posXX, posYY, distance) {
	return {
		life : 1,
		damage : 1,
		speed : 2,
		bulletSpeed : 1,
		width : 80,
		height : 80,
		image : enemyImage,
		posX : posXX,
		posY : posYY,
		distanceToMove : distance,
		alive : true,
		shootTicks : Math.floor((Math.random() * 600) + 100),
		killPoints : 60
	};
}

function createTankShooterEnemy(posXX, posYY, distance) {
	return {
		life : 3,
		damage : 2,
		speed : 1,
		bulletSpeed : 2,
		width : 80,
		height : 80,
		image : enemyTankImage,
		posX : posXX,
		posY : posYY,
		distanceToMove : distance,
		alive : true,
		shootTicks : Math.floor((Math.random() * 1000) + 800),
		killPoints : 80
	};
}

function updateEnemies() {
	for (var i = 0; i < enemies.length; i++) {
		var enemy = enemies[i];
		if (enemy.distanceToMove > 0) {
			enemy.distanceToMove -= enemy.speed;
			enemy.posY += enemy.speed;
		}
		
		enemy.shootTicks -= 1;
		if (enemy.shootTicks < 0) {
			enemy.shootTicks = Math.floor((Math.random() * 1000) + 500)
			createEnemyBullets(enemy);
		}
		
		if (enemy.life <= 0) {
			enemy.alive = false;
			player.score += enemy.killPoints;
		}
	}
	
	var tmp = [];
	for (var j = 0; j < enemies.length; j++) {
		if (enemies[j].alive) {
			tmp.push(enemies[j]);
		}
	}
	enemies = tmp;

	if (enemies.length == 0) {
		var enemyTypeGroup = Math.floor(Math.random() * 3);
		switch(enemyTypeGroup) {
			case 0: 
				createSimpleEnemiesGroup(createSimpleEnemiesGroup);
				break;
			case 1:
				createSimpleEnemiesGroup(createFastShooterEnemy);
				break;
			case 2:
				createSimpleEnemiesGroup(createTankShooterEnemy);
				break;
		}
	}
}

function drawEnemies() {
	for (var i = 0; i < enemies.length; i++) {
		var enemy = enemies[i];
		context.drawImage(enemy.image, enemy.posX, enemy.posY, enemy.width, enemy.height);
	}
}

////////////////// BULLET

var bulletImage = new Image();
bulletImage.src = 'img/bullet_enemy.png';

var enemyBullets = [];

function updateEnemyBullets() {
	for (var i = 0; i < enemyBullets.length; i++) {
		var bullet = enemyBullets[i];
		bullet.posY += bullet.speed;
		if (bullet.posY > game.height) {
			bullet.alive = false;
		}
		
		if (collides(bullet, player)) {
			player.life -= bullet.damage;
			bullet.alive = false;
		}
	}
	
	var tmp = [];
	for (var j = 0; j < enemyBullets.length; j++) {
		if (enemyBullets[j].alive) {
			tmp.push(enemyBullets[j]);
		}
	}
	enemyBullets = tmp;
}

function drawEnemyBullets() {
	for (var i = 0; i < enemyBullets.length; i++) {
		var bullet = enemyBullets[i];
		context.drawImage(bullet.image, bullet.posX, bullet.posY, bullet.width, bullet.height);
	}
}

function createEnemyBullets(enemy) {
	var posYY = enemy.posY + enemy.height;
	var posXX = enemy.posX + (enemy.width - 20) / 2;
	
	var bullet = {
		width : 20,
		height : 35,
		speed : enemy.bulletSpeed,
		image : bulletImage,
		posX : posXX,
		posY : posYY,
		alive : true,
		damage : enemy.damage
	};
	enemyBullets.push(bullet);
}

////////////////// PLAYER

var playerImage = new Image();
playerImage.src = 'img/bgbattleship.png';

var player;

function createPlayer() {
	return {
		width : 128,
		height : 128,
		posX : game.width / 2 - 128 / 2,
		posY : game.height - 128 - 10,
		image : playerImage,
		moveSpeed : 2,
		life: 5,
		damage : 1,
		shootDelay : 0,
		score : 0
	};
}

var playerBullets = [];

function drawPlayer() {
	if (player != null) {
		context.drawImage(player.image, player.posX, player.posY, player.width, player.height);
	}
}

function updatePlayer() {
	player.shootDelay = Math.max(player.shootDelay - 1, 0);
	if (player.life <= 0) {
		game.state = OVER;
	}
}

function movePlayerLeft() {
    player.posX = Math.max(player.posX - player.moveSpeed, 0);
}

function movePlayerRight() {
    player.posX = Math.min(player.posX + player.moveSpeed, game.width - player.width);
}

function movePlayerDown() {
	player.posY = Math.min(player.posY + player.moveSpeed, game.height - player.height);
}

function movePlayerUp() {
	player.posY = Math.max(player.posY - player.moveSpeed, 0);
}

function playerShoot() {
	if (player.shootDelay == 0) {
		player.shootDelay = 100;
		createPlayerBullets(player);
	}
}

function drawPlayerBullets() {
	for (var i = 0; i < playerBullets.length; i++) {
		var bullet = playerBullets[i];
		
		context.beginPath();
		context.arc(bullet.posX, bullet.posY, bullet.width, 0, Math.PI * 2);
		context.fillStyle = '#882288';
		context.fill();
		context.stroke();
	}
}

function updatePlayerBullets() {
	for (var i = 0; i < playerBullets.length; i++) {
		var bullet = playerBullets[i];
		
		bullet.posY -= bullet.speed;
		if (bullet.posY < 0) {
			bullet.alive = false;
		}
		
		for (var l = 0; l < enemies.length; l++) {
			var enemy = enemies[l];
			if (collides(bullet, enemy)) {
				bullet.alive = false;
				enemy.life -= 1;
			}
		}
	}
	
	var tmp = [];
	for (var j = 0; j < playerBullets.length; j++) {
		if (playerBullets[j].alive) {
			tmp.push(playerBullets[j]);
		}
	}
	playerBullets = tmp;
}

function createPlayerBullets(player) {
	var posYY = player.posY;
	var posXX = player.posX + player.width / 2;
	
	var bullet = {
		width : 8,
		height : 8,
		speed : 3,
		posX : posXX,
		posY : posYY,
		alive : true
	};

	playerBullets.push(bullet);
}

function collides(body1, body2) {
	return (body1.posX < body2.posX + body2.width &&
		body1.posX + body1.width > body2.posX &&
		body1.posY < body2.posY + body2.height &&
		body1.height + body1.posY > body2.posY);
}