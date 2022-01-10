import { getDateString, getEndOfThisMonth, getEndOfThisWeek, getEndOfThisYear, getEndOfToday, getFullDateString, getStartOfToday, getTimeString, getWeekdayString } from "./common/misc/date_functions"

/**
 * 
 */
 export class IntervalFormat extends BaseFormat {

    protected getFormattedHeadingString(todo){
        var heading = ""       
        var todoDate =  new Date(todo.todo_due)
        if (todo.todo_due == 0){
            heading = "No Due Date"
        } else if (todoDate < getStartOfToday()){
            heading = "Overdue"
        } else if (todoDate < getEndOfToday()){
            heading = "Today"
        } else if (todoDate < getEndOfThisWeek()){
            heading = "This Week"
        } else if (todoDate < getEndOfThisMonth()){
            heading = "This Month"
        } else if (todoDate < getEndOfThisYear()){
            heading = "This Year"
        } else {
            heading = "Future"
        }
        return heading
    }

    protected getFormattedTodoString(todo, heading, profile){
        var dueDate = ""
        if (heading == "No Due Date"){
            dueDate = ``
        } else if (heading == "Overdue") {
            dueDate = `${getFullDateString(todo.todo_due, profile.yearFormat, profile.monthFormat, profile.dayFormat)} - `
        } else if (heading == "Today") {
            dueDate = `${getTimeString(todo.todo_due, profile.hourFormat, profile.minuteFormat, profile.timeIs12Hour)} - `
        } else if (heading == "This Week") {
            dueDate = `${getWeekdayString(todo.todo_due, profile.weekdayFormat)} - `
        } else if (heading == "This Month"){
                        dueDate =  `${getDateString(todo.todo_due, profile.monthFormat, profile.dayFormat)} - `
        } else if (heading == "This Year"){
            dueDate = `${getDateString(todo.todo_due, profile.monthFormat, profile.dayFormat)} - `
        } else if (heading == "Future") {
            dueDate = `${getFullDateString(todo.todo_due, profile.yearFormat, profile.monthFormat, profile.dayFormat)} - `
        }
        return `${dueDate}${todo.title}`
    }

}
