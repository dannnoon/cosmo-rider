var keysDown = {};

document.addEventListener("keydown", function(e) {
	keysDown[e.keyCode] = true;

	if (e.keyCode == 80) {
		if (game.state == GAME) {
			game.state = PAUSE;
		} else if (game.state == PAUSE) {
			game.state = GAME;
		}
	}
}, false);

document.addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
}, false);