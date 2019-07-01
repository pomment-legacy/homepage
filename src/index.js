import { inform, exec } from 'ef.js';
import page from 'page';
import Body from './compoments/body.eft';
import Nav from './compoments/nav.eft';
import Home from './compoments/home.eft';
import HomeHeader from './compoments/home-header.eft';
import 'normalize.css';
import './sass/index.scss';

const body = new Body();
const nav = new Nav();
const home = new Home();
const homeHeader = new HomeHeader();
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
    body.content = home;
    exec();
});

page.exit('home', (ctx, next) => {
    next();
});

page({ hashbang: true });

body.$mount({ target: document.body, option: 'replace' });
