import joplin from "api"


var yearFormat = null
var monthFormat = null
var dayFormat = null
var weekdayFormat = null
var timeFormat = null

export async function loadDateSettings(){
    yearFormat = await joplin.settings.value("agendaDateYearFormat")
    monthFormat = await joplin.settings.value("agendaDateMonthFormat")
    dayFormat = await joplin.settings.value("agendaDateDayFormat")
    weekdayFormat = await joplin.settings.value("agendaDateWeekdayFormat")
    timeFormat  = await joplin.settings.value("agendaTimeFormat")
}

export function getWeekdayString(date){
    return new Date(date).toLocaleDateString(undefined, {weekday: weekdayFormat})
}

export function getFullDateString(date){
    return new Date(date).toLocaleDateString(undefined, {year: yearFormat, month: monthFormat,  day: dayFormat} )
}

export function getDateString(date){
    return new Date(date).toLocaleDateString(undefined, {month: monthFormat,  day: dayFormat} )
}

export function getTimeString(date){
    return new Date(date).toLocaleTimeString(undefined, {hour: 'numeric', minute: 'numeric', hour12: timeFormat})
}
