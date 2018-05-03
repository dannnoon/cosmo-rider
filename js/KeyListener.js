var keysDown = {};

document.addEventListener("keydown", function(e) {
keysDown[e.keyCode] = true;

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
}, false);

document.addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
}, false);