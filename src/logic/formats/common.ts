/** Imports ****************************************************************************************************************************************/
import { getTodos } from "../joplin/todos";
import { DateFormat } from "./date";
import { IntervalFormat } from "./interval";

/** Variable Declaration ***************************************************************************************************************************/
export var formats = {
    'interval': IntervalFormat,
    'date': DateFormat
}

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

    protected abstract getFormattedHeadingString(todo): string   
    
    protected abstract getFormattedTodoString(todo, heading): string
    
    public async getTodos(mode){
        var finalString = ""
        var todoList = await getTodos(this.profile.showCompleted, this.profile.showNoDue, this.profile.searchCriteria)
        var todoMap = this.groupBy(todoList, this.getFormattedHeadingString)
        console.log(todoMap)
        for (var dateGroup of todoMap){
            finalString = finalString.concat(this.getHeadingString(dateGroup[0], mode))    
            for (var todo of dateGroup[1]){
                finalString = finalString.concat(this.getTodoString(todo, dateGroup[0], mode))    
            }
        }
        return finalString
    }
    
    private getHeadingString(headingString, mode){
        if (mode == "markdown"){
            return `## ${headingString}`    
        } else if (mode == "html") {
            return `<h2>${headingString}</h2>`; 
        }
    }
    
    private getTodoString(todo, heading, mode){
        var todoString = this.getFormattedTodoString(todo, heading)
        if (mode == "markdown"){
            var checkedString = todo.todo_completed ? "x" : "" 
            return `- [${checkedString}] [${todoString}](:/${todo.id})`    
        } else if (mode == "html") {
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
     * Takes an array, and a grouping function, and returns a Map of the array grouped by the grouping function.                                     *
     * Source: https://stackoverflow.com/a/38327540                                                                                                     *
     ***************************************************************************************************************************************************/
    private groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

    /** getWeekdayString ********************************************************************************************************************************
     * Takes the given date and returns a string representing the weekday the date falls on.                                                            *
     ***************************************************************************************************************************************************/
    protected getWeekdayString(date){
        return new Date(date).toLocaleDateString(undefined, {
            weekday: this.profile.weekdayFormat
        })
    }

    /** getFullDateString *******************************************************************************************************************************
     * Takes the given date and returns a string representing the full date, including year, month and day                                              *
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
     ***************************************************************************************************************************************************/
    protected getDateString(date){
        return new Date(date).toLocaleDateString(undefined, {
            month: this.profile.monthFormat,  
            day: this.profile.dayFormat
        })
    }

    /** getTimeString ***********************************************************************************************************************************
     * Takes the given date and returns a string representing the time                                                                                  *
     ***************************************************************************************************************************************************/
    protected getTimeString(date){
        return new Date(date).toLocaleTimeString(undefined, {
            hour: 'numeric', 
            minute: 'numeric', 
            hour12: this.profile.timeIs12Hour
        })
    }


    /** getStartOfToday *********************************************************************************************************************************
     * Gets the date representing the start of the current day. Used for comparison.                                                                    *
     ***************************************************************************************************************************************************/
    protected getStartOfToday(){
        var startOfToday = new Date()
        startOfToday.setHours(0,0,0,0);
        return startOfToday    
    }

    /** getEndOfToday ***********************************************************************************************************************************
     * Gets the date representing the end of the current day. Used for comparison.                                                                      *
     ***************************************************************************************************************************************************/
    protected getEndOfToday(){
        var endOfToday = new Date();
        endOfToday.setHours(23,59,59,999);
        return endOfToday   
    }

    /** getEndOfThisWeek ********************************************************************************************************************************
     * Gets the date representing the end of the current week. Used for comparison.                                                                     *
     ***************************************************************************************************************************************************/
    protected getEndOfThisWeek(){
        var endOfWeek = new Date()
        endOfWeek.setDate(endOfWeek.getDate() - (endOfWeek.getDay() - 1) + 6);
        endOfWeek.setHours(23,59,59,999); 
        return endOfWeek;    
    }

    /** getEndOfThisMonth *******************************************************************************************************************************
     * Gets the date representing the end of the current month. Used for comparison.                                                                    *
     ***************************************************************************************************************************************************/
    protected getEndOfThisMonth(){
        var endOfMonth = new Date()
        endOfMonth = new Date(endOfMonth.getFullYear(), endOfMonth.getMonth() + 1, 0);
        return endOfMonth    
    }

    /** getEndOfThisYear ********************************************************************************************************************************
     * Gets the date representing the end of the current year. Used for comparison.                                                                     *
     ***************************************************************************************************************************************************/
    protected getEndOfThisYear(){
        var endOfYear = new Date(new Date().getFullYear(), 11, 31) 
        return endOfYear
    }
}
