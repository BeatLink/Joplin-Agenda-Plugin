/** Imports ****************************************************************************************************************************************/
import { getTodos } from "../../joplin";

/** BaseFormat **************************************************************************************************************************************
 * This is the abstract class that all other formats must inherit from.                                                                             *
 ***************************************************************************************************************************************************/
export abstract class BaseFormat {

    constructor(profile) {
        this.profile = profile
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
     * This is the main method of this class. It returns the formatted list of todos according to the profile parameters passed at class            *
     * initialization and the given output format, whether it be "html" or "markdown"                                                               *
     ***********************************************************************************************************************************************/
    public async getTodos(outputFormat){
        this.outputFormat = outputFormat
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
        if (this.outputFormat == "markdown"){
            return `## ${headingString}`    
        } else if (this.outputFormat == "html") {
            return `<h2>${headingString}</h2>`; 
        }
    }
    
    /** getTodoString *******************************************************************************************************************************
     * This returns the given todo as a string, with the proper output format (i.e html or markdown.)                                               *
     ***********************************************************************************************************************************************/
    private getTodoString(todo, heading){
        var todoString = this.getFormatTodoString(todo, heading)
        if (this.outputFormat == "markdown"){
            var checkedString = todo.todo_completed ? "x" : "" 
            return `- [${checkedString}] [${todoString}](:/${todo.id})`    
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
