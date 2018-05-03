var keysDown = {};

document.addEventListener("keydown", function(e) {
	keysDown[e.keyCode] = true;
}, false);

document.addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
}, false);