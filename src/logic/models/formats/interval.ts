import { BaseFormat } from "./common/baseFormat"

/** IntervalFormat **********************************************************************************************************************************
 * This format groups todos by specific dates then names the todo according to the due time on that date                                            *
 ***************************************************************************************************************************************************/
 export class IntervalFormat extends BaseFormat {

    protected getFormatHeadingString(todo){
        var heading = ""  
        console.log(this.profile)
        console.log(this.getStartOfToday)
        console.log(this.getStartOfToday())     
        var todoDate =  new Date(todo.todo_due)
        if (todo.todo_due == 0){
            heading = "No Due Date"
        } else if (todoDate < this.getStartOfToday()){
            heading = "Overdue"
        } else if (todoDate < this.getEndOfToday()){
            heading = "Today"
        } else if (todoDate < this.getEndOfThisWeek()){
            heading = "This Week"
        } else if (todoDate < this.getEndOfThisMonth()){
            heading = "This Month"
        } else if (todoDate < this.getEndOfThisYear()){
            heading = "This Year"
        } else {
            heading = "Future"
        }
        return heading
    }

    protected getFormatTodoString(todo, heading){
        var dueDate = ""
        if (heading == "Overdue") {
            dueDate = `${this.getFullDateString(todo.todo_due)} - `
        } else if (heading == "Today") {
            dueDate = `${this.getTimeString(todo.todo_due)} - `
        } else if (heading == "This Week") {
            dueDate = `${this.getWeekdayString(todo.todo_due)} - `
        } else if (heading == "This Month"){
            dueDate =  `${this.getDateString(todo.todo_due)} - `
        } else if (heading == "This Year"){
            dueDate = `${this.getDateString(todo.todo_due)} - `
        } else if (heading == "Future") {
            dueDate = `${this.getFullDateString(todo.todo_due)} - `
        }
        return `${dueDate}${todo.title}`
    }
}
