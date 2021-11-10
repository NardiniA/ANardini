function fadeOut(el) {
	el.style.opacity = 1;

	(function fade() {
		if ((el.style.opacity -= 0.1) < 0) {
			el.style.display = "none";
		} else {
			requestAnimationFrame(fade);
		}
	})();
}

window.addEventListener("load", (e) => {
	setTimeout(() => {
		fadeOut(document.querySelector(".preloader"));
	}, 500);
});