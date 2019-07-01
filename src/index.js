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

page('/*', (ctx) => {
    if (ctx.path === '/') {
        page.redirect('home');
        return;
    }
    page.redirect(ctx.path.replace(/^\/+/, ''));
});

page('home', () => {
    inform();
    home.header = homeHeader;
    home.info = homeInfo;
    body.$data.page = 'home';
    body.content = home;
    exec();
});

page.exit('home', (ctx, next) => {
    next();
});

page({ hashbang: true });

body.$mount({ target: document.body, option: 'replace' });
