/** README ******************************************************************************************************************************************
 *  This file contains the base format abstract class that forms the basis of the customizable formatting system. All custom formats must implement *
 *  this class                                                                                                                                      *
 ***************************************************************************************************************************************************/

/** Imports ****************************************************************************************************************************************/
import { getTodos } from "./joplin";

/** BaseFormat **************************************************************************************************************************************
 * This is the abstract class that all other formats must inherit from.                                                                             *
 ***************************************************************************************************************************************************/
abstract class BaseFormat {

    /** constructor *********************************************************************************************************************************
     * This constructor takes and stores the profile that contains customizations as well as the output format, whether it be "html" or "markdown"  *
     ***********************************************************************************************************************************************/
    constructor(profile, outputFormat) {
        this.profile = profile
        this.outputFormat = outputFormat
    }

    /** profile *************************************************************************************************************************************
     * This stores the current profile data used to customize the formatting of the todos                                                           *
     ***********************************************************************************************************************************************/
    protected profile = null

    /** outputFormat ********************************************************************************************************************************
     * This stores the output format that the todos are requested in. Valid values are "html" and "markdown"                                        *
     ***********************************************************************************************************************************************/
    private outputFormat = null

    /** getFormattedHeadingString *******************************************************************************************************************
     * This method should return the heading string that the given todo would fall under. All formats must implement this method.                   *
     ***********************************************************************************************************************************************/
    protected abstract getFormatHeadingString(todo): string
    
    /** getFormattedTodoString **********************************************************************************************************************
     * This method should return the string representation of the given todo and heading. All formats must implement this method                    *
     ***********************************************************************************************************************************************/
    protected abstract getFormatTodoString(todo, heading): string
    
    /** getTodos ************************************************************************************************************************************
     * This is the main method of this class. It returns the formatted list of todos according to the profile parameters and output format passed   *
     * at class initialization,                                                                                                                     *
     ***********************************************************************************************************************************************/
    public async getTodos(){
        var todoString = ""
        var todoList = await getTodos(this.profile.showCompleted, this.profile.showNoDue, this.profile.searchCriteria)
        var todoMap = this.groupBy(todoList)
        for (var headingGroup of todoMap){
            var heading = headingGroup[0]
            todoString += this.getHeadingString(heading)
            for (var todo of headingGroup[1]){
                todoString += this.getTodoString(todo, heading) 
            }
        }
        return todoString
    }
    
    /** getHeadingString ****************************************************************************************************************************
     * This returns the given heading string with the proper output format(i.e html or markdown)                                                    *
     ***********************************************************************************************************************************************/
    private getHeadingString(headingString){
        if (headingString){
            if (this.outputFormat == "markdown"){
                return `## ${headingString}\n`    
            } else if (this.outputFormat == "html") {
                return `<h2>${headingString}</h2>`; 
            }    
        } else {
            return ""
        }
    }
    
    /** getTodoString *******************************************************************************************************************************
     * This returns the given todo as a string, with the proper output format (i.e html or markdown.)                                               *
     ***********************************************************************************************************************************************/
    private getTodoString(todo, heading){
        var todoString = this.getFormatTodoString(todo, heading)
        if (this.outputFormat == "markdown"){
            var checkedString = todo.todo_completed ? "x" : " "
            return `- [${checkedString}] [${todoString}](:/${todo.id})\n`    
        } else if (this.outputFormat == "html") {
            var checkedString = todo.todo_completed ? "checked" : "" 
            return `
                <p>
                    <input type="checkbox" onchange="onTodoChecked('${todo.id}')" ${checkedString}>
                    <a onclick="onTodoClicked('${todo.id}')">${todoString}</a>
                </p>
            `            
        }
    }
    
    /** groupBy *****************************************************************************************************************************************
     * Takes an array, and a grouping function, and returns a Map of the array grouped by the grouping function.                                        *
     * Source: https://stackoverflow.com/a/38327540                                                                                                     *
     ***************************************************************************************************************************************************/
    private groupBy(todoList) {
        const map = new Map();
        todoList.forEach((todo) => {
            const heading =  this.getFormatHeadingString(todo);
            const headingGroup = map.get(heading);
            if (!headingGroup) {
                map.set(heading, [todo]);
            } else {
                headingGroup.push(todo);
            }
        });
        return map;
    }

    /** getWeekdayString ********************************************************************************************************************************
     * Takes the given date and returns a string representing the weekday the date falls on.                                                            *
     * Provided as convenience for use in custom formats                                                                                                *
     ***************************************************************************************************************************************************/
    protected getWeekdayString(date){
        return new Date(date).toLocaleDateString(undefined, {
            weekday: this.profile.weekdayFormat
        })
    }

    /** getFullDateString *******************************************************************************************************************************
     * Takes the given date and returns a string representing the full date, including year, month and day.                                             *
     * Provided as convenience for use in custom formats                                                                                                *
     ***************************************************************************************************************************************************/
    protected getFullDateString(date){
        return new Date(date).toLocaleDateString(undefined, {
            year: this.profile.yearFormat, 
            month: this.profile.monthFormat,  
            day: this.profile.dayFormat
        })
    }

    /** getDateString ***********************************************************************************************************************************
     * Takes the given date and returns a string representing the date without the year                                                                 *
     * Provided as convenience for use in custom formats                                                                                                *
     ***************************************************************************************************************************************************/
    protected getDateString(date){
        return new Date(date).toLocaleDateString(undefined, {
            month: this.profile.monthFormat,  
            day: this.profile.dayFormat
        })
    }

    /** getTimeString ***********************************************************************************************************************************
     * Takes the given date and returns a string representing the time                                                                                  *
     * Provided as convenience for use in custom formats                                                                                                *
     ***************************************************************************************************************************************************/
    protected getTimeString(date){
        return new Date(date).toLocaleTimeString(undefined, {
            hour: 'numeric', 
            minute: 'numeric', 
            hour12: this.profile.timeIs12Hour
        })
    }

    /** getStartOfToday *********************************************************************************************************************************
     * Gets the date representing the start of the current day. Provided as convenience for use in custom formats.                                      *                                                                    *
     ***************************************************************************************************************************************************/
    protected getStartOfToday(){
        var startOfToday = new Date();
        startOfToday.setHours(0,0,0,0);
        return startOfToday;
    }

    /** getEndOfToday ***********************************************************************************************************************************
     * Gets the date representing the end of the current day. Provided as convenience for use in custom formats                                         *                            *
     ***************************************************************************************************************************************************/
    protected getEndOfToday(){
        var endOfToday = new Date();
        endOfToday.setHours(23,59,59,999);
        return endOfToday   
    }

    /** getEndOfThisWeek ********************************************************************************************************************************
     * Gets the date representing the end of the current week. Provided as convenience for use in custom formats                                        *                            *
     ***************************************************************************************************************************************************/
    protected getEndOfThisWeek(){
        var endOfWeek = new Date()
        endOfWeek.setDate(endOfWeek.getDate() - (endOfWeek.getDay() - 1) + 6);
        endOfWeek.setHours(23,59,59,999); 
        return endOfWeek;    
    }

    /** getEndOfThisMonth *******************************************************************************************************************************
     * Gets the date representing the end of the current month. Provided as convenience for use in custom formats                                       *                            *
     ***************************************************************************************************************************************************/
    protected getEndOfThisMonth(){
        var endOfMonth = new Date()
        endOfMonth = new Date(endOfMonth.getFullYear(), endOfMonth.getMonth() + 1, 0);
        return endOfMonth    
    }

    /** getEndOfThisYear ********************************************************************************************************************************
     * Gets the date representing the end of the current year. Provided as convenience for use in custom formats                                        *                            *
     ***************************************************************************************************************************************************/
    protected getEndOfThisYear(){
        var endOfYear = new Date(new Date().getFullYear(), 11, 31) 
        return endOfYear
    }
}

/** BasicFormat **************************************************************************************************************************************
 * This format groups doesnt group tasks at all.                                                                                                     *
 ***************************************************************************************************************************************************/
 class BasicFormat extends BaseFormat {

    /** getFormatHeadingString **********************************************************************************************************************
     * Sets the heading according to the built in full date string creation method if the task has a due date or otherwise sets it to "No Due Date" *
     ***********************************************************************************************************************************************/
    protected getFormatHeadingString(todo){
        return ""
    }

    /** getFormatTodoString *************************************************************************************************************************
     * Formats the todo by prepending it with the time it should be done                                                                            *
    ************************************************************************************************************************************************/
    protected getFormatTodoString(todo, heading){
        return todo.title
    }
}


/** DateFormat **************************************************************************************************************************************
 * This format groups tasks by date and sorts them by time.                                                                                         *
 ***************************************************************************************************************************************************/
class DateFormat extends BaseFormat {

    /** getFormatHeadingString **********************************************************************************************************************
     * Sets the heading according to the built in full date string creation method if the task has a due date or otherwise sets it to "No Due Date" *
     ***********************************************************************************************************************************************/
    protected getFormatHeadingString(todo){
        if (todo.todo_due != 0) {
            return this.getFullDateString(todo.todo_due)
        } else {
            return "No Due Date"
        } 
    }

    /** getFormatTodoString *************************************************************************************************************************
     * Formats the todo by prepending it with the time it should be done                                                                            *
    ************************************************************************************************************************************************/
    protected getFormatTodoString(todo, heading){
        var dueTime = todo.todo_due != 0 ? `${this.getTimeString(todo.todo_due)} - ` : ""
        return `${dueTime}${todo.title}`
    }
}

/** IntervalFormat **********************************************************************************************************************************
 * This format groups todos by specific dates then names the todo according to the due time on that date                                            *
 ***************************************************************************************************************************************************/
class IntervalFormat extends BaseFormat {

    protected getFormatHeadingString(todo){
        var heading = ""
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

/** formats *****************************************************************************************************************************************
 * This convenience dict stores all formats using their names as keys                                                                               *
 ***************************************************************************************************************************************************/
export var formats = {
    'basic': BasicFormat,
    'interval': IntervalFormat,
    'date': DateFormat,
}
