import { getDateString, getFullDateString, getTimeString, getWeekdayString } from "../dates"
import { groupBy } from "../../misc/groupby"
import { getStartOfToday, getEndOfToday, getEndOfThisWeek, getEndOfThisMonth, getEndOfThisYear } from "src/misc/dates"
import { Format } from "./_interface_"


export class IntervalFormat extends Format {

    protected getHeadingString(todo){
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

    protected getTodoString(todo, heading){
        var dateFormats = {
            "No Due Date": ``,
            "Overdue": `${getFullDateString(todo.todo_due)} - `,
            "Today": `${getTimeString(todo.todo_due)} - `,
            "This Week": `${getWeekdayString(todo.todo_due)} - `,
            "This Month": `${getDateString(todo.todo_due)} - `,
            "This Year": `${getDateString(todo.todo_due)} - `,
            "Future": `${getFullDateString(todo.todo_due)} - `,
        }
        var dueDate = dateFormats[heading]
        return `${dueDate}${todo.title}`
    }
}
