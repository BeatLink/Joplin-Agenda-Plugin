/* Imports *****************************************************************************************************************************************/
import joplin from 'api';
import { getDateString, getFullDateString, getTimeString, getWeekdayString } from '../core/dates';
import { connectNoteChangedCallback, getTodos, openTodo, toggleTodoCompletion as toggleTodoCompletion } from '../core/joplin';
import { groupBy } from "../misc/groupby"
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

