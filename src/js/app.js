import { settings, select, classNames} from './settings.js';
import Product from './Components/product.js';
import Cart from './Components/cart.js';

const app = {

  initPages: function () {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;

    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');
    console.log('idFromHash', idFromHash);

    let pageMatchingHash = thisApp.pages[0].id;

    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = pageId;
        break;
      }
    }

    //console.log('pageMatchingHash', pageMatchingHash);

    thisApp.activatePage(pageMatchingHash);
    //thisApp.activatePage(thisApp.pages[0].id);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();

        /* get page Id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run thisApp.activePage with that id*/
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#' + id;
      })
    }
  },


  activatePage: function (pageId) {
    const thisApp = this;

    /*  add class "active" to matching pages, remove from non-matching */
    for (let page of thisApp.pages) {
      // if (page.id == pageId) {
      // page.classList.add(classNames.pages.active);
      // } else {
      //  page.classList.remove(classNames.pages.active);
      // }

      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    /* add class "active" to matching links, remove from non-matchin */
    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }



  },

  initMenu: function () {
    const thisApp = this;
    //console.log('thisApp.data', thisApp.data);

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      //new Product(productData, thisApp.data.products[productData])// zmienione w module 9 na "id";

    }
    //const testProduct = n ew Product();
    //console.log('testProduct', testProduct);
  },

  initData: function () {
    const thisApp = this;

    thisApp.data = {};

    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);

        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;

        /* execute initMenu method */
        thisApp.initMenu();

      });

    console.log('thisApp.data', JSON.stringify(thisApp.data));

    //thisApp.data = dataSource;
  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },

  init: function () {
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    //console.log('templates:', templates);

    thisApp.initPages();
    thisApp.initData();
    //thisApp.initMenu(); deleted in 9 modul and push to initMenu function
    thisApp.initCart();
  },
};

app.init();