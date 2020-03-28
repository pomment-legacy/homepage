import 'normalize.css/normalize.css';
import './sass/index.scss';

const topMenu = document.getElementById('top-menu');
const burgerBtn = document.getElementById('burger-btn');
const gap = 40;
let brightLock = false;
let menuOpen = false;
let menuTimer;

const navColor = () => {
    if (brightLock) {
        return;
    }
    if (window.pageYOffset >= gap) {
        topMenu.classList.add('bright');
    } else {
        topMenu.classList.remove('bright');
    }
};

const openMobileMenu = () => {
    menuOpen = true;
    brightLock = true;
    topMenu.classList.add('bright');
    clearTimeout(menuTimer);
    topMenu.classList.add('opened');
    burgerBtn.className = 'burger-btn step-2';
    menuTimer = setTimeout(() => {
        burgerBtn.className = 'burger-btn step-3 step-2-3';
    }, 150);
};

const closeMobileMenu = () => {
    menuOpen = false;
    clearTimeout(menuTimer);
    topMenu.classList.remove('opened');
    burgerBtn.className = 'burger-btn step-2 step-2-3';
    menuTimer = setTimeout(() => {
        burgerBtn.className = 'burger-btn';
        brightLock = false;
        navColor();
    }, 150);
};

burgerBtn.onclick = () => {
    if (menuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
};

window.addEventListener('scroll', navColor);
