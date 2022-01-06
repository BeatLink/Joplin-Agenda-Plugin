/* Imports *****************************************************************************************************************************************/
import joplin from 'api';
import { getDateString, getFullDateString, getTimeString, getWeekdayString } from '../core/date-formats';
import { connectNoteChangedCallback, getTodos, openTodo, toggleTodoCompletion as toggleTodoCompletion } from '../core/joplin';
import { groupBy } from "../core/misc"
const fs = joplin.require('fs-extra');


var HTMLFilePath = null;
var BaseHTML = null
var panel = null;
var formatterList = {
    'date': getDateFormat,
    'interval': getIntervalFormat
}
var updateNeeded = false;


/** setupPanel **************************************************************************************************************************************
 * Sets up the panel                                                                                                                                *
 ****************************************************************************************************************************************************/
export async function createPanel(){
    HTMLFilePath = (await joplin.plugins.installationDir()) + "/gui/panel/panel.html"
    BaseHTML = await fs.readFile(HTMLFilePath, 'utf8');
    panel = await joplin.views.panels.create('panel')
    await joplin.views.dialogs.addScript(panel, 'gui/panel/panel.js')
    await joplin.views.dialogs.addScript(panel, 'gui/panel/panel.css')
    await joplin.views.panels.onMessage(panel, async (message) => {
        if (message[0] == 'todoClicked'){
            await openTodo(message[1])
        } else if (message[0] == 'todoChecked'){
            await toggleTodoCompletion(message[1])
            await updatePanelData()
        }
    })
}

export async function setupPanelUpdatePolling(){
    async function tripFlag(event?){
        updateNeeded = true;
    }
    async function pollForUpdates(){
        if (updateNeeded){
            await updatePanelData()
            updateNeeded = false;
        }    
    }
    await connectNoteChangedCallback(tripFlag)
    setInterval(pollForUpdates, 1000)
}

/** updatePanelData *********************************************************************************************************************************
 * Displays all todos in the panel, grouped by date and sorted by time                                                                              *
 ***************************************************************************************************************************************************/
export async function updatePanelData(event?){
    if (event) {
        console.log(event)
    }
    var visibility = await joplin.settings.value('agendaPanelVisibility')
    var showCompleted = await joplin.settings.value("agendaShowCompletedTodos")
    var showNoDue = await joplin.settings.value("agendaShowNoDueDateTodos")
    var format = await joplin.settings.value("agendaPanelFormat")
    var searchCriteria = await joplin.settings.value("agendaSearchCritera")
    await joplin.views.panels.show(panel, visibility) 
    if (visibility){
        var todoList = await getTodos(showCompleted, showNoDue, searchCriteria)
        var formatter = formatterList[format]
        var formattedTodosHTML = await formatter(todoList)
        var replacedHTML = BaseHTML.replace("<<TODOS>>", formattedTodosHTML)
        await joplin.views.panels.setHtml(panel, replacedHTML);
    }
}

export async function getDateFormat(todoList){
    var formattedHTML = ""
    var todoArray = groupBy(todoList, (todo) => { return todo.todo_due != 0 ? getFullDateString(todo.todo_due) : "No Due Date" })
    for (var dateGroup of todoArray){
        formattedHTML = formattedHTML.concat(`<h2 class="agendaDate">${dateGroup[0]}</h2>`)    
        for (var todo of dateGroup[1]){
            var dueTime = todo.todo_due != 0 ? getTimeString(todo.todo_due) : ""
            var checkedString = todo.todo_completed != 0 ? "checked" : ""
            var todoHTMLString = `
                <p class="agendaTodo">
                    <input type="checkbox" onchange="onTodoChecked('${todo.id}')" ${checkedString}>
                    <a onclick="onTodoClicked('${todo.id}')">${dueTime} ${todo.title}</a>
                </p>
            `
            formattedHTML = formattedHTML.concat(todoHTMLString)    
        }
    }
    return formattedHTML
}

export async function getIntervalFormat(todoList){
    var formattedHTML = ""

    var startOfToday = new Date()
    startOfToday.setHours(0,0,0,0);

    var endOfToday = new Date();
    endOfToday.setHours(23,59,59,999);

    var endOfWeek = new Date()
    endOfWeek.setDate(endOfWeek.getDate() - (endOfWeek.getDay() - 1) + 6);
    endOfWeek.setHours(23,59,59,999);


    var endOfMonth = new Date()
    endOfMonth = new Date(endOfMonth.getFullYear(), endOfMonth.getMonth() + 1, 0);

    var endOfYear = new Date(new Date().getFullYear(), 11, 31)

    function intervalGrouping(todo){
        var todoDate =  new Date(todo.todo_due)
        if (todo.todo_due == 0){
            return "No Due Date"
        }
        if (todoDate < startOfToday){
            return "Overdue"
        } 
        if (todoDate < endOfToday){
            return "Today"
        }
        if (todoDate < endOfWeek){
            return "This Week"
        }
        if (todoDate < endOfMonth){
            return "This Month"
        }
        if (todoDate < endOfYear){
            return "This Year"
        }
        return "Future"
    }

    var todoArray = groupBy(todoList, intervalGrouping)
    for (var dateGroup of todoArray){
        formattedHTML = formattedHTML.concat(`<h2>${dateGroup[0]}</h2>`)    
        for (var todo of dateGroup[1]){
            var dateFormats = {
                "No Due Date": ``,
                "Overdue": `${getFullDateString(todo.todo_due)} - `,
                "Today": `${getTimeString(todo.todo_due)} - `,
                "This Week": `${getWeekdayString(todo.todo_due)} - `,
                "This Month": `${getDateString(todo.todo_due)} - `,
                "This Year": `${getDateString(todo.todo_due)} - `,
                "Future": `${getFullDateString(todo.todo_due)} - `,
            }    
            var checkedString = todo.todo_completed ? "checked" : "" 
            var dueDate = dateFormats[dateGroup[0]]
            var todoHTMLString = `
                <p>
                    <input type="checkbox" onchange="onTodoChecked('${todo.id}')" ${checkedString}>
                    <a onclick="onTodoClicked('${todo.id}')">${dueDate}${todo.title}</a>
                </p>
            `
            formattedHTML = formattedHTML.concat(todoHTMLString)    
        }
    }
    return formattedHTML
    
}