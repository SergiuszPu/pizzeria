import { templates, select, classNames, settings } from '../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './amountWidget.js';
import DatePicker from './datePicker.js';
import HourPicker from './hourPicker.js';


class Booking {
    constructor(widgetElem, ) {
        const thisBooking = this;

        thisBooking.render(widgetElem);
        thisBooking.initWidgets();
        thisBooking.getData();
        thisBooking.selectTable();
    }

    getData() {
        const thisBooking = this;

        const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
        const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);


        const params = {
            booking: [
                startDateParam,
                endDateParam,
            ],
            eventsCurrent: [
                settings.db.notRepeatParam,
                startDateParam,
                endDateParam,

            ],
            eventsRepeat: [
                settings.db.RepeatParam,
                endDateParam,

            ],
        };
        //console.log('params', params);


        const urls = {
            booking: settings.db.url + '/' + settings.db.booking
                + '?' + params.booking.join('&'),
            eventsCurrent: settings.db.url + '/' + settings.db.event
                + '?' + params.eventsCurrent.join('&'),
            eventsRepeat: settings.db.url + '/' + settings.db.event
                + '?' + params.eventsRepeat.join('&'),
        };
        //console.log('urls', urls);

        Promise.all([
            fetch(urls.booking),
            fetch(urls.eventsCurrent),
            fetch(urls.eventsRepeat),
        ])
            .then(function (allResponses) {
                const bookingsResponse = allResponses[0];
                const eventsCurrentResponse = allResponses[1];
                const eventsRepeatResponse = allResponses[2];
                return Promise.all([
                    bookingsResponse.json(),
                    eventsCurrentResponse.json(),
                    eventsRepeatResponse.json(),
                ]);
            })
            .then(function ([bookings, eventsCurrent, eventsRepeat]) {
                //console.log('booking',bookings);
                //console.log('eventsCurrents',eventsCurrent);
                //console.log('eventRepeat',eventsRepeat);
                thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
            });
    }

    parseData(bookings, eventsCurrent, eventsRepeat) {
        const thisBooking = this;

        thisBooking.booked = {};

        for (let item of bookings) {
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }

        for (let item of eventsCurrent) {
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }

        const minDate = thisBooking.datePicker.minDate;
        const maxDate = thisBooking.datePicker.maxDate;

        for (let item of eventsRepeat) {
            if (item.repeat == 'daily') {
                for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
                    thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
                }
            }
        }

        console.log('thisBooking.booked', thisBooking.booked);
        thisBooking.updateDOM();
        thisBooking.rangeColourHour();
    }

    selectTable(tableId) {
        const thisBooking = this;

        thisBooking.selectedTable = tableId;

        console.log(thisBooking.selectedTable)

    }


    makeBooked(date, hour, duration, table) {
        const thisBooking = this;

        if (typeof thisBooking.booked[date] == 'undefined') {
            thisBooking.booked[date] = {};
        }

        const startHour = utils.hourToNumber(hour);


        for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
            //console.log('loop', hourBlock);

            if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
                thisBooking.booked[date][hourBlock] = [];
            }

            thisBooking.booked[date][hourBlock].push(table);
        }

    }

    updateDOM() {
        const thisBooking = this;

        thisBooking.date = thisBooking.datePicker.value;
        thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

        let allAvailable = false;

        if (typeof thisBooking.booked[thisBooking.date] == 'undefined'
            ||
            typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
        ) {
            allAvailable = true;
        }

        for (let table of thisBooking.dom.tables) {
            let tableId = table.getAttribute(settings.booking.tableIdAttribute);
            if (!isNaN(tableId)) {
                tableId = parseInt(tableId);
            }
            if (
                !allAvailable
                &&
                thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
            ) {
                table.classList.add(classNames.booking.tableBooked);
            } else {
                table.classList.remove(classNames.booking.tableBooked);
            }
        }
    }
    render(element) {
        const thisBooking = this;

        const generatedHTML = templates.bookingWidget();

        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;
        thisBooking.dom.wrapper.innerHTML = generatedHTML;

        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
        thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
        thisBooking.dom.hoursPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
        thisBooking.dom.inputPhone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
        thisBooking.dom.inputAddress = thisBooking.dom.wrapper.querySelector(select.booking.address);
        thisBooking.dom.starter = thisBooking.dom.wrapper.querySelector(select.booking.starter);
        thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    }

    initWidgets() {
        const thisBooking = this;

        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hoursPicker);

        thisBooking.dom.wrapper.addEventListener('updated', function () {
            thisBooking.updateDOM();
        });

        thisBooking.dom.wrapper.addEventListener('submit', function () {
            event.preventDefault();
            thisBooking.sendBooking();
        });

        thisBooking.dom.datePicker.addEventListener('updated', function () {
            if (thisBooking.booked[thisBooking.date] &&
                typeof thisBooking.booked[thisBooking.date][thisBooking.hour] !== 'undefined') {
                thisBooking.booked.classList.remove('active');
            }
        })

        for (let table of thisBooking.dom.tables) {
            table.addEventListener('click', function () {

                for (let t of thisBooking.dom.tables) {
                    t.classList.remove('active');
                }

                table.classList.add('active');

                const tableId = table.getAttribute('data-table');

                thisBooking.selectTable(tableId);
            });
        };
    }

    sendBooking() {
        const thisBooking = this;

        const url = settings.db.url + '/' + settings.db.booking;

        const payload = {
            date: thisBooking.date,
            hour: thisBooking.hour,
            table: thisBooking.selectTable,
        };


        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        };


        fetch(url, options)
            .then(function (response) {
                return response.json();
            }).then(function (parsedResponse) {
                console.log('parsedResponse: ', parsedResponse);

            });

    }
    rangeColourHour() {
        const thisBooking = this;
        const bookedHours = thisBooking.booked[thisBooking.date];

        const sliderColor = [];
        thisBooking.dom.rangeSlider = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.slider);

        const slider = thisBooking.dom.rangeSlider;

        for (let bookedHour in bookedHours) {
            const firstOfInterval = 0;
            const secondOfInterval = (((bookedHour - 12) + .5) * 100) / 12;
            if (bookedHour < 24) {
                if
                    (bookedHours[bookedHour].length <= 1) {
                    sliderColor
                        .push('/*' + bookedHour + '*/green ' + firstOfInterval + '%, green ' + secondOfInterval + '%');
                } else if
                    (bookedHours[bookedHour].length == 2) {
                    sliderColor
                        .push('/*' + bookedHour + '*/orange ' + firstOfInterval + '%, orange ' + secondOfInterval + '% ');
                } else if
                    (bookedHours[bookedHour].length >= 3) {
                    sliderColor
                        .push('/*' + bookedHour + '*/red ' + firstOfInterval + '%, red ' + secondOfInterval + '%');
                }
            }
        }
        sliderColor.sort();
        const colorString = sliderColor.join();
        slider.style.background = 'linear-gradient(to right, ' + colorString + ')';
        //console.log(bookedHours);
    }
}
export default Booking;