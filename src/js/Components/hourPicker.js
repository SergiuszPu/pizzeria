import { select, settings } from '../settings.js';
import { utils } from '../utils.js';
import BaseWidget from './baseWidget.js';

class HourPicker extends BaseWidget {
    constructor(wrapper) {
        super(wrapper, settings.hours.open);
        const thisWidget = this;

        thisWidget.dom = {};
        thisWidget.dom.wrapper = wrapper;

        thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
        thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
        //console.log(thisWidget.dom.wrapper);

        thisWidget.initPlugin();
        thisWidget.value = thisWidget.dom.input.value;
    }

    initPlugin() {
        const thisWidget = this;

        thisWidget.dom.input.addEventListener('input', function () {
            thisWidget.value = thisWidget.dom.input.value;
        });

        rangeSlider.create(thisWidget.dom.input); 
        
     


    }

    parseValue(value) {
        return utils.numberToHour(value);

    }

    isValid() {
        return true;
    }

    renderValue() {
        const thisWidget = this;

        thisWidget.dom.output.innerHTML = thisWidget.value;
    }
}

export default HourPicker;