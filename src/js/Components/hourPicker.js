import { settings } from "../settings";
import { utils } from '../utils.js';
import BaseWidget from './baseWidget.js';

class HourPicker extends BaseWidget {
    constructor(wrapper) {
        super(wrapper, settings.hours.open);
        const thisWidget = this;

        thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(thisBooking.dom.datePicker.input);
        thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(thisBooking.dom.datePicker.output);

        thisWidget.initPlugin();
        thisWidget.value = thisWidget.dom.input.value;
    }

    initPlugin() {
        const thisWidget = this;
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