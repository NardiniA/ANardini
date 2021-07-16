/*==================== THEME TOGGLE ====================*/
const selectedTheme = localStorage.getItem('selected-theme');

if (selectedTheme) {
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove']('dark-theme');
}

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
    const nav = document.querySelector('.header');
    // When the scroll is greater than 80 viewport height, add the scroll-header class
    if (this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header');
}

window.addEventListener('scroll', scrollHeader);