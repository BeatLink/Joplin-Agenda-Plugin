/* Imports *****************************************************************************************************************************************/
import joplin from 'api';
import { getTodos, openTodo, toggleTodoCompletion as toggleTodoCompletion } from './joplin';
import { formatterList } from './formats';

var panel = null;

/** setupPanel **************************************************************************************************************************************
 * Sets up the panel                                                                                                                                *
 ****************************************************************************************************************************************************/
export async function createPanel(){
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

/** updatePanelData *********************************************************************************************************************************
 * Displays all todos in the panel, grouped by date and sorted by time                                                                              *
 ***************************************************************************************************************************************************/
export async function updatePanelData(){  
    var visibility = await joplin.settings.value('agendaPanelVisibility')
    await joplin.views.panels.show(panel, visibility) 
    if (visibility){
        var format = await joplin.settings.value("agendaPanelFormat")
        var formatter = formatterList[format]
        console.log(formatter)
        var formattedTodosHTML = await formatter(await getTodos())
        const BaseHTML = await require('./panel.html').default;
        var replacedHTML = BaseHTML.replace("<<TODOS>>", formattedTodosHTML)
        await joplin.views.panels.setHtml(panel, replacedHTML);
    }
}
