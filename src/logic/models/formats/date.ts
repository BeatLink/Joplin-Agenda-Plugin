import { BaseFormat } from "./base"

export class DateFormat extends BaseFormat {

    protected getFormatHeadingString(todo){
        if (todo.todo_due != 0) {
            return this.getFullDateString(todo.todo_due)
        } else {
            return "No Due Date"
        } 
    }

    protected getFormatTodoString(todo, heading){
        var dueTime = todo.todo_due != 0 ? `${this.getTimeString(todo.todo_due)} - ` : ""
        return `${dueTime}${todo.title}`
    }
}
