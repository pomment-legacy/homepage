import { inform, exec } from 'ef.js';
import axios from 'axios';
import page from 'page';
import marked from 'marked';
import hljs from 'highlight.js';
import hljsNginx from 'highlight.js/lib/languages/nginx';
import PommentWidget from 'pomment-frontend/src/frontend';
import DumbSDK from './dumb-sdk';
import Body from './compoments/body.eft';
import Nav from './compoments/nav.eft';
import Home from './compoments/home.eft';
import HomeHeader from './compoments/home-header.eft';
import HomeInfo from './compoments/home-info.eft';
import Doc from './compoments/doc.eft';
import LoadingCircle from './compoments/loading-circle.eft';
import DocItem from './compoments/doc-item.eft';
import DocCategory from './compoments/doc-category.eft';

import './sass/index.scss';

const body = new Body();
const nav = new Nav();
const home = new Home();
const homeHeader = new HomeHeader();
const homeInfo = new HomeInfo();
const doc = new Doc();

const navItems = 3;
const docWhiteList = [];
let gap = 108;
let articleList = null;
let brightLock = false;

body.nav = nav;
body.$data.year = new Date().getFullYear();

const navColor = () => {
    if (brightLock) {
        return;
    }
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
    for (let i = 0; i < navItems; i += 1) {
        nav.$data[`active${i}`] = '';
    }
    nav.$data[`active${item}`] = 'focus';
};

const loadMenu = async () => {
    if (articleList !== null) {
        return;
    }
    doc.$data.loadingHidden = '';
    doc.$data.docHidden = 'hidden';
    doc.$data.failedHidden = 'hidden';
    try {
        const res = await axios({
            url: 'document/content.json',
        });
        doc.$data.loadingHidden = 'hidden';
        doc.$data.docHidden = '';
        articleList = res.data;
        const categoryName = Object.keys(articleList);
        categoryName.forEach((e) => {
            const category = new DocCategory({
                $data: {
                    title: e,
                },
            });
            const itemName = Object.keys(articleList[e]);
            itemName.forEach((f) => {
                docWhiteList.push(articleList[e][f]);
                const item = new DocItem({
                    $data: {
                        name: `#!doc/${articleList[e][f]}`,
                        title: f,
                    },
                });
                category.item.push(item);
            });
            doc.categories.push(category);
        });
    } catch (e) {
        doc.$data.loadingHidden = 'hidden';
        doc.$data.failedHidden = '';
        throw e;
    }
};

const loadArticle = async (artName) => {
    if (docWhiteList.indexOf(artName) < 0) {
        doc.$data.loadingHiddenA = 'hidden';
        doc.$data.docHiddenA = 'hidden';
        doc.$data.failedHiddenA = '';
        console.error(`${artName} is not whitelisted`);
        return;
    }
    doc.$data.loadingHiddenA = '';
    doc.$data.docHiddenA = 'hidden';
    doc.$data.failedHiddenA = 'hidden';
    try {
        const res = await axios({
            url: `document/${artName}.md`,
        });
        doc.$data.loadingHiddenA = 'hidden';
        doc.$data.docHiddenA = '';
        doc.$refs.content.innerHTML = marked(res.data);
        const hlNeeded = doc.$refs.content.querySelectorAll('pre code');
        Array.prototype.forEach.call(hlNeeded, (e) => {
            hljs.highlightBlock(e);
        });
    } catch (e) {
        doc.$data.loadingHiddenA = 'hidden';
        doc.$data.failedHiddenA = '';
        throw e;
    }
};

// 路由设定

page('/*', (ctx) => {
    if (ctx.path === '/') {
        page.redirect('home');
        return;
    }
    page.redirect(ctx.path.replace(/^\/+/, ''));
});

page('home', toTop, () => {
    inform();
    gap = 108;
    setNav(0);
    home.header = homeHeader;
    home.info = homeInfo;
    body.$data.page = 'home';
    body.content = home;
    homeInfo.demoWidget = new PommentWidget({
        fixedHeight: 56,
        SDKProvider: DumbSDK,
    });
    homeInfo.demoWidget.load();
    exec(true);
});

page.exit('home', (ctx, next) => {
    next();
});

page('doc', () => {
    page.redirect('doc/get-started');
});

page('doc/*', toTop, async (ctx) => {
    console.log(ctx);
    inform();
    gap = 16;
    setNav(1);
    body.$data.page = 'doc';
    body.content = doc;
    doc.loading = new LoadingCircle();
    doc.loadingA = new LoadingCircle();
    exec(true);
    try {
        await loadMenu();
        await loadArticle(ctx.params[0]);
    } catch (e) {
        console.error(e);
    }
});

// nav

let menuOpen = false;
let menuTimer;

const closeMobileMenu = () => {
    menuOpen = false;
    clearTimeout(menuTimer);
    nav.$data.mobileOpened = '';
    nav.$data.burgerStep = 'step-2 step-2-3';
    menuTimer = setTimeout(() => {
        nav.$data.burgerStep = '';
        brightLock = false;
        navColor();
    }, 150);
};

const openMobileMenu = () => {
    menuOpen = true;
    brightLock = true;
    nav.$data.color = 'bright';
    clearTimeout(menuTimer);
    nav.$data.mobileOpened = 'opened';
    nav.$data.burgerStep = 'step-2';
    menuTimer = setTimeout(() => {
        nav.$data.burgerStep = 'step-3 step-2-3';
    }, 150);
};

nav.$methods.clickBurger = () => {
    if (menuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
};

nav.$methods.closeMenu = closeMobileMenu;

// init

page({ hashbang: true });
hljs.registerLanguage('nginx', hljsNginx);
body.$mount({ target: document.body, option: 'replace' });
window.addEventListener('scroll', navColor);

if (process.env.NODE_ENV !== 'production') {
    console.info(`Build date: ${process.env.PMHP_BUILD_DATE}`);
}
