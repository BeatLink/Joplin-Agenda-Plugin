/** getWeekdayString ********************************************************************************************************************************
 * Takes the given date and returns a string representing the weekday the date falls on.                                                            *
 ***************************************************************************************************************************************************/
export function getWeekdayString(date, weekdayFormat){
    return new Date(date).toLocaleDateString(undefined, {weekday: weekdayFormat})
}

/** getFullDateString *******************************************************************************************************************************
 * Takes the given date and returns a string representing the full date, including year, month and day                                              *
 ***************************************************************************************************************************************************/
export function getFullDateString(date, yearFormat, monthFormat, dayFormat){
    return new Date(date).toLocaleDateString(undefined, {year: yearFormat, month: monthFormat,  day: dayFormat} )
}

/** getDateString ***********************************************************************************************************************************
 * Takes the given date and returns a string representing the date without the year                                                                 *
 ***************************************************************************************************************************************************/
export function getDateString(date, monthFormat, dayFormat){
    return new Date(date).toLocaleDateString(undefined, {month: monthFormat,  day: dayFormat} )
}

/** getTimeString ***********************************************************************************************************************************
 * Takes the given date and returns a string representing the time                                                                                  *
 ***************************************************************************************************************************************************/
export function getTimeString(date, hourFormat, minuteFormat, timeIs12Hour){
    return new Date(date).toLocaleTimeString(undefined, {hour: hourFormat, minute: minuteFormat, hour12: timeIs12Hour})
}


/** getStartOfToday *********************************************************************************************************************************
 * Gets the date representing the start of the current day. Used for comparison.                                                                    *
 ***************************************************************************************************************************************************/
export function getStartOfToday(){
    var startOfToday = new Date()
    startOfToday.setHours(0,0,0,0);
    return startOfToday    
}

/** getEndOfToday ***********************************************************************************************************************************
 * Gets the date representing the end of the current day. Used for comparison.                                                                      *
 ***************************************************************************************************************************************************/
export function getEndOfToday(){
    var endOfToday = new Date();
    endOfToday.setHours(23,59,59,999);
    return endOfToday   
}

/** getEndOfThisWeek ********************************************************************************************************************************
 * Gets the date representing the end of the current week. Used for comparison.                                                                     *
 ***************************************************************************************************************************************************/
export function getEndOfThisWeek(){
    var endOfWeek = new Date()
    endOfWeek.setDate(endOfWeek.getDate() - (endOfWeek.getDay() - 1) + 6);
    endOfWeek.setHours(23,59,59,999); 
    return endOfWeek;    
}

/** getEndOfThisMonth *******************************************************************************************************************************
 * Gets the date representing the end of the current month. Used for comparison.                                                                    *
 ***************************************************************************************************************************************************/
export function getEndOfThisMonth(){
    var endOfMonth = new Date()
    endOfMonth = new Date(endOfMonth.getFullYear(), endOfMonth.getMonth() + 1, 0);
    return endOfMonth    
}

/** getEndOfThisYear ********************************************************************************************************************************
 * Gets the date representing the end of the current year. Used for comparison.                                                                     *
 ***************************************************************************************************************************************************/
export function getEndOfThisYear(){
    var endOfYear = new Date(new Date().getFullYear(), 11, 31) 
    return endOfYear
}


