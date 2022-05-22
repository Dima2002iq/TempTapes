const {getScaleString} = require("./timescale.js");
const ONE_DAY = 1000 * 60 * 60 * 24;

function isValidRange(date_start, date_end) {
    return date_start < date_end;
}

function isInRange(date_start, current, date_end) {
    return date_start <= current && current <= date_end;
}

function daysDiff(date_start, date_end) {
    return (date_end - date_start) / ONE_DAY;
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.addMonths = function(months) {
    var date = new Date(this.valueOf());
    date.setMonth(date.getMonth() + months);
    return date;
}

Date.prototype.addYears = function(years) {
    var date = new Date(this.valueOf());
    date.setFullYear(date.getFullYear() + years);
    return date;
}

Date.prototype.formatted = function() {
    var date = new Date(this.valueOf());
    return date.toISOString().slice(0, 10);
}


function addScale(date, value) {
    switch (getScaleString()) {
        case "day":
            return date.addDays(value);
        case "month":
            return date.addMonths(value);
        case "year":
            return date.addYears(value);
    }
}

function monthsDiff(date_start, date_end) {
    var months;
    months = (date_end.getFullYear() - date_start.getFullYear()) * 12;
    months -= date_start.getMonth();
    months += date_end.getMonth();
    return months <= 0 ? 0 : months;
}

function yearsDiff(date_start, date_end) {
    var years = date_end.getFullYear() - date_start.getFullYear();
    return years <= 0 ? 0 : years;
}

function initTimeline(date_start, date_end) {
    var tm_start = document.getElementById('timelineStart');
    var tm_current = document.getElementById('timelineCurrent');
    var tm_end = document.getElementById('timelineEnd');

    tm_start.value = date_start;
    tm_current.value = tm_start.value;
    tm_end.value = date_end;

    tm_start.old = tm_start.value;
    tm_current.old = tm_current.value;
    tm_end.old = tm_end.value;

    updateRange();
}

function updateCurrentTime() {
    var value = Number(document.getElementById('timelineRange').value);
    var date = getStartDate(document.getElementById('timelineRange'));
    setCurrentDate(addScale(date, value), true);
}

function syncRange(date_start, date_current, date_end) {
    var range = document.getElementById('timelineRange');
    
    switch (getScaleString()) {
        case "day": 
            range.min = 0;
            range.value = daysDiff(date_start, date_current);
            range.max = daysDiff(date_start, date_end);
            break;
        case "month":
            range.min = 0;
            range.value = monthsDiff(date_start, date_current);
            range.max = monthsDiff(date_start, date_end);
            break;
        case "year":
            range.min = 0;
            range.value = yearsDiff(date_start, date_current);
            range.max = yearsDiff(date_start, date_end);
            break;
    }
}

function updateRange() {
    var date_start = getStartDate(true);
    var date_current = getCurrentDate(true);
    var date_end = getEndDate(true);

    if (!isValidRange(date_start, date_end) || 
        !isInRange(date_start, date_current, date_end)) {
        this.value = this.old;
        return;
    }

    syncRange(date_start, date_current, date_end);
    this.old = this.value;
}

function getInputDate(input_id, asdate=false) {
    var value = document.getElementById(input_id).value;
    if (asdate)
        return new Date(value); 
    return value;
}

function getStartDate(asdate=false) {
    return getInputDate('timelineStart', asdate);
}

function getCurrentDate(asdate=false) {
    return getInputDate('timelineCurrent', asdate);
}

function getEndDate(asdate=false) {
    return getInputDate('timelineEnd', asdate);
}

function setCurrentDate(value, asdate=false) {
    var date_start = getStartDate(true);
    var date_current = asdate ? value : new Date(value);
    var date_end = getEndDate(true);
    
    if (!isInRange(date_start, date_current, date_end)) 
        return;

    var tm_current = document.getElementById('timelineCurrent');
    tm_current.valueAsDate = date_current;
    tm_current.old = tm_current.value;
    
    syncRange(date_start, date_current, date_end);
}

function incrementCurrentDate() {
    var date = getCurrentDate(true);
    console.log(addScale(date, 1));
    setCurrentDate(addScale(date, 1), true);
}

function decrementCurrentDate(value=-1) {
    var date = getCurrentDate(true);
    setCurrentDate(addScale(date, -1), true);
}

module.exports =  {
    initTimeline: initTimeline,
    updateRange: updateRange, 
    updateCurrentTime: updateCurrentTime,
    getStartDate: getStartDate,
    getCurrentDate: getCurrentDate,
    getEndDate: getEndDate,
    setCurrentDate: setCurrentDate,
    incrementCurrentDate: incrementCurrentDate,
    decrementCurrentDate: decrementCurrentDate
};

