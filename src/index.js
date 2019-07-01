import { inform, exec } from 'ef.js';
import page from 'page';
import Body from './compoments/body.eft';
import Nav from './compoments/nav.eft';
import Home from './compoments/home.eft';
import HomeHeader from './compoments/home-header.eft';
import HomeInfo from './compoments/home-info.eft';
import './sass/index.scss';

const body = new Body();
const nav = new Nav();
const home = new Home();
const homeHeader = new HomeHeader();
const homeInfo = new HomeInfo();
body.nav = nav;

const toTop = (ctx, next) => {
    window.scrollTo(0, 0);
    next();
};

const navColor = () => {
    const gap = 108;
    if (window.pageYOffset >= gap) {
        nav.$data.color = 'bright';
    } else {
        nav.$data.color = '';
    }
};

page('/*', (ctx) => {
    if (ctx.path === '/') {
        page.redirect('home');
        return;
    }
    page.redirect(ctx.path.replace(/^\/+/, ''));
});

page('home', toTop, () => {
    inform();
    home.header = homeHeader;
    home.info = homeInfo;
    nav.$data.color = '';
    body.$data.page = 'home';
    body.content = home;
    window.addEventListener('scroll', navColor);
    exec();
});

page.exit('home', (ctx, next) => {
    window.removeEventListener('scroll', navColor);
    next();
});

page({ hashbang: true });

body.$mount({ target: document.body, option: 'replace' });
