import { inform, exec } from 'ef.js';
import page from 'page';
import marked from 'marked';
import PommentWidget from 'pomment-frontend/src/frontend';
import DumbSDK from './dumb-sdk';
import Body from './compoments/body.eft';
import Nav from './compoments/nav.eft';
import Home from './compoments/home.eft';
import HomeHeader from './compoments/home-header.eft';
import HomeInfo from './compoments/home-info.eft';
import Doc from './compoments/doc.eft';
import './sass/index.scss';

const body = new Body();
const nav = new Nav();
const home = new Home();
const homeHeader = new HomeHeader();
const homeInfo = new HomeInfo();
const doc = new Doc();
body.nav = nav;
body.$data.year = new Date().getFullYear();

const navColor = () => {
    const gap = 108;
    if (window.pageYOffset >= gap) {
        nav.$data.color = 'bright';
    } else {
        nav.$data.color = '';
    }
};

const toTop = (ctx, next) => {
    window.scrollTo(0, 0);
    navColor();
    next();
};

const setNav = (item) => {
    const navItems = 4;
    for (let i = 0; i < navItems; i += 1) {
        nav.$data[`active${i}`] = '';
    }
    nav.$data[`active${item}`] = 'focus';
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
    setNav(0);
    home.header = homeHeader;
    home.info = homeInfo;
    nav.$data.color = '';
    body.$data.page = 'home';
    body.content = home;
    homeInfo.demoWidget = new PommentWidget({
        fixedHeight: 56,
        SDKProvider: DumbSDK,
    });
    homeInfo.demoWidget.load();
    window.addEventListener('scroll', navColor);
    exec(true);
});

page.exit('home', (ctx, next) => {
    window.removeEventListener('scroll', navColor);
    next();
});

page('doc', toTop, () => {
    inform();
    setNav(1);
    body.content = doc;
    exec(true);
});

page({ hashbang: true });

body.$mount({ target: document.body, option: 'replace' });
console.log(marked(`# demo

Hello World!!! I am tcdw ~~aaaaaaaa~~`));

if (process.env.NODE_ENV !== 'production') {
    console.info(`Build date: ${process.env.PMHP_BUILD_DATE}`);
}
