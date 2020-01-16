import { select, settings } from '../settings.js';
import { utils } from '../utils.js';
import BaseWidget from './baseWidget.js';

class HourPicker extends BaseWidget {
    constructor(wrapper) {
        super(wrapper, settings.hours.open);
        const thisWidget = this;

        console.log(wrapper);

        thisWidget.dom = {};
        thisWidget.dom.wrapper = wrapper;
        
        thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
        thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);

        thisWidget.initPlugin();
        thisWidget.value = thisWidget.dom.input.value;
    }

    initPlugin() {
        const thisWidget = this;

        rangeSlider.create(thisWidget.dom.input)
        
        thisWidget.dom.input.addEventListener('input', function () {
            thisWidget.value = thisWidget.dom.imput.value;
        });
        

    }

    parseValue() {
        return utils.numberToHour(value);
    }

    isValid() {
        return true;
    }
    renderValue() {
        const thisWidget = this;
        thisWidget.dom.output = thisWidget.value;
    }
}

export default HourPicker;