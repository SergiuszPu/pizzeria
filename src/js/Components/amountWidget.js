import { settings, select } from '../settings.js';
import BaseWidget from './baseWidget.js';

class AmountWidget extends BaseWidget {
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);

    const thisWidget = this;

    thisWidget.getElements(element);

    /*usuwamy te dwie wartosci poniewaz teraz tym zajmuje sie  constructor klasy nadrzednej*/
    //thisWidget.value = settings.amountWidget.defaultValue;
    //thisWidget.setValue(thisWidget.dom.input.value);

    thisWidget.initAction();

    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments:', element);
  }

  //getElements(element)
  getElements() { 
    const thisWidget = this;

    //thisWidget.dom.wrapper = element; usuwamy w modu 10.3 poniewaz zajmues sie metoda baseWIdget
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);

    //thisWidget.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    //thisWidget.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  isValid(value) {
    return !isNaN(value)
      && value <= settings.amountWidget.defaultMax
      && value >= settings.amountWidget.defaultMin;

  }

  renderValue(){
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;

  }

  initAction() {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function () {
      //thisWidget.setValue(thisWidget.dom.input.value);
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function () {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function () {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }


}

export default AmountWidget;