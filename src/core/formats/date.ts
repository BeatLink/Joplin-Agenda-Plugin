import { getFullDateString, getTimeString } from "../dates"
import { Format } from "./_interface_"

export class DateFormat extends Format {

    protected getHeadingString(todo){
        return todo.todo_due != 0 ? getFullDateString(todo.todo_due) : "No Due Date"
    }

    protected getTodoString(todo, heading){
        var dueTime = todo.todo_due != 0 ? `${getTimeString(todo.todo_due)} - ` : ""
        return `${dueTime}${todo.title}`
    }
}



