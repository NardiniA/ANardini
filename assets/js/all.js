/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.querySelector("#nav-menu"),
	navToggle = document.querySelector("#nav-toggle"),
	navClose = document.querySelector("#nav-close");

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if (navToggle) {
	navToggle.addEventListener("click", () => {
		navMenu.classList.add("show-menu");
	});
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if (navClose) {
	navClose.addEventListener("click", () => {
		navMenu.classList.remove("show-menu");
	});
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll(".nav__link");

function linkAction() {
	const navMenu = document.querySelector("#nav-menu");

	navMenu.classList.remove("show-menu");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*==================== CHANGE BACKGROUND HEADER ====================*/ 
function scrollHeader() {
    const nav = document.getElementById('header');
    // When the scroll is greater than 80 viewport height, add the scroll-header class
    if(this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header');
}

window.addEventListener('scroll', scrollHeader);

/*==================== DARK LIGHT THEME ====================*/ 
const themeButton = document.querySelector('#theme-button'),
    darkTheme = 'dark-theme',
    iconTheme = 'uil-sun';

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun';

// we validate if the user previously chose a topic
if (selectedTheme) {
    // if the validation is fulfilled, we ask what the issue was to know if we activated or desctivated the dark-theme
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme);
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);
    // we save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
});

/*==================== ANALYTICS ====================*/
function getConsent() {
	// Show Consent Modal
	let c = document.querySelector("#consent");
	c.classList.add("active-modal");

	// Get Modal Options
	let btns = c.querySelectorAll(".modal-btn");
	btns.forEach((b) => {
		b.addEventListener("click", (e) => {
			if (b.classList.contains("modal-btn-decline")) {
				localStorage.setItem("analytics-consent", false);
				c.classList.remove("active-modal");
			} else {
				localStorage.setItem("analytics-consent", true);
				c.classList.remove("active-modal");
				ackee();
			}
		});
	});

	// Set Consent if modal close
	let close = c.querySelector(".modal-close");
	close.addEventListener("click", (e) => {
		localStorage.setItem("analytics-consent", true);
		c.classList.remove("active-modal");
		ackee();
	});
}

function ackee(detail) {
	const instance = ackeeTracker
		.create("https://admin.antonionardini.com", {
			detailed: detail
		})
		.record("4b70428b-b19c-4cf6-a203-9538ec35379c");
}

window.addEventListener("DOMContentLoaded", (e) => {
	const consent = localStorage.getItem("analytics-consent");
	if (consent === "true") {
		ackee(true);
	} else if (consent === null || consent === undefined) {
		getConsent();
	} else {
		ackee(false);
	}
});
