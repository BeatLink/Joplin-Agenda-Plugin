import { getFullDateString, getTimeString } from "./common/misc/date_functions"

export class DateFormat extends BaseFormat {

    protected getFormattedHeadingString(todo, profile){
        return todo.todo_due != 0 ? getFullDateString(todo.todo_due, profile.yearFormat, profile.monthFormat, profile.dayFormat) : "No Due Date"
    }

    protected getFormattedTodoString(todo, heading, profile){
        var dueTime = todo.todo_due != 0 ? `${getTimeString(todo.todo_due, profile.hourFormat, profile.minuteFormat, profile.timeIs12Hour)} - ` : ""
        return `${dueTime}${todo.title}`
    }
}
