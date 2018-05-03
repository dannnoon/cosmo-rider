////////////////////// GAME

var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");

var game = {
    width : canvas.width,
    height : canvas.height,
	gameOver : false
}

function updateGame() {
	if (!game.gameOver) {
		updateStars();
		updateEnemies();
		updatePlayer();
		updateEnemyBullets();
		updatePlayerBullets();
	}
}

function drawGame() {
	context.fillStyle = '#000000';
    context.fillRect(0, 0, game.width, game.height);
	
	if (!game.gameOver) {
		drawStars();
		drawEnemies();
		drawPlayer();
		drawEnemyBullets();
		drawPlayerBullets();
	} else {
		
	}
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

var enemies = [];

function createSimpleEnemiesGroup() {
	for (var i = 0; i < 5; i++) {
		var enemy = createSimpleEnemy(((game.width - 20) / 5) * i + 20, -80, 120);
		enemies.push(enemy);
	}
}

createSimpleEnemiesGroup();

function createSimpleEnemy(posXX, posYY, distance) {
	return {
		life : 1,
		damage : 1,
		speed : 1,
		width : 80,
		height : 80,
		image : enemyImage,
		posX : posXX,
		posY : posYY,
		distanceToMove : distance,
		alive : true,
		shootTicks : Math.floor((Math.random() * 1000) + 500)
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
			player.score += 50;
		}
	}
	
	var tmp = [];
	for (var j = 0; j < enemies.length; j++) {
		if (enemies[j].alive) {
			tmp.push(enemies[j]);
		}
	}
	enemies = tmp;
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
			player.life -= 1;
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
		speed : 1,
		image : bulletImage,
		posX : posXX,
		posY : posYY,
		alive : true
	};
	enemyBullets.push(bullet);
}

////////////////// PLAYER

var playerImage = new Image();
playerImage.src = 'img/bgbattleship.png';

var player = {
    width : 128,
    height : 128,
    posX : game.width / 2 - 128 / 2,
    posY : game.height - 128 - 10,
    image : playerImage,
    moveSpeed : 8,
	life: 5,
	damage : 1,
	shootDelay : 0,
	score : 0
};

var playerBullets = [];

function drawPlayer() {
    context.drawImage(player.image, player.posX, player.posY, player.width, player.height);
}

function updatePlayer() {
	player.shootDelay = Math.max(player.shootDelay - 1, 0);
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
		context.arc(bullet.posX, bullet.posY, 12, 0, Math.PI * 2);
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
		width : 30,
		height : 30,
		speed : 1,
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