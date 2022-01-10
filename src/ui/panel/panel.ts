/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { ToolbarButtonLocation } from "api/types";
import { formats } from "src/logic/formats/common/formatsList";
import { openNote, toggleTodoCompletion } from "src/logic/todos";
const fs = joplin.require('fs-extra');

/** Variable Declaration ***************************************************************************************************************************/
var htmlFilePath = null;
var baseHtml = null
var panel = null;

/** createPanel *************************************************************************************************************************************
 * Sets up the panel                                                                                                                                *
 ****************************************************************************************************************************************************/
 export async function createPanel(){
    htmlFilePath = (await joplin.plugins.installationDir()) + "/gui/panel/panel.html"
    baseHtml = await fs.readFile(htmlFilePath, 'utf8');
    panel = await joplin.views.panels.create('panel')
    await joplin.views.dialogs.addScript(panel, 'gui/panel/panel.js')
    await joplin.views.dialogs.addScript(panel, 'gui/panel/panel.css')
    await joplin.views.panels.onMessage(panel, panelEventHandler)
    await setupVisbilityToolbarButton()
}

/** setupVisibilityToolbarButton ********************************************************************************************************************
 * Sets up the toolbar button that toggles the panel visibility                                                                                     *                                                                                                            *
 ***************************************************************************************************************************************************/
 async function setupVisbilityToolbarButton(){
    async function togglePanelVisibility(){
        var visibility = await joplin.views.panels.visible(panel)
        await joplin.views.panels.show(panel, visibility) 
    }    
    await joplin.commands.register({ 
        name: 'agendaTogglePanelVisibility',                       
        label: 'Toggle Agenda Panel',                     
        iconName: 'fas fa-calendar',                  
        execute: togglePanelVisibility
    })
    await joplin.views.toolbarButtons.create( 
        'agendaTogglePanelVisibilityButton',
        'agendaTogglePanelVisibility',
        ToolbarButtonLocation.NoteToolbar
    )
}

/** panelEventHandler *******************************************************************************************************************************
 * This function processes messages and events sent from the panel's inner javascript.                                                              *
 ***************************************************************************************************************************************************/
async function panelEventHandler(message){
    if (message[0] == 'todoClicked'){
        await openNote(message[1])
    } else if (message[0] == 'todoChecked'){
        await toggleTodoCompletion(message[1])
    }
}

/** updatePanelData *********************************************************************************************************************************
 * Displays all todos in the panel, grouped by date and sorted by time                                                                              *
 ***************************************************************************************************************************************************/
 export async function updatePanelData(todoList, profile: Profile, event?){
    var formatter = formats[profile.displayFormat]
    var formattedHTML = formatter.getString(todoList)
    var replacedHTML = baseHtml.replace("<<TODOS>>", formattedHTML)
    await joplin.views.panels.setHtml(panel, replacedHTML);
 }





