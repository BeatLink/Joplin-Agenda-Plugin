/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { ToolbarButtonLocation } from "api/types";
import { openTodo, toggleTodoCompletion } from "../../logic/joplin/todos";
const fs = joplin.require('fs-extra');

/** Variable Declaration ***************************************************************************************************************************/
var baseHtml = "";
var panel = null;


/** setupPanel **************************************************************************************************************************************
 * Initializes the panel on joplin startup.                                                                                                         *
 ***************************************************************************************************************************************************/
export async function setupPanel(){
    await createPanel();
    await setupToolbarButton()
}

/** createPanel *************************************************************************************************************************************
 * Creates the panel in joplin and connects the evwent handler.                                                                                     *
 ***************************************************************************************************************************************************/
async function createPanel(){
    async function panelEventHandler(message){
        if (message[0] == 'todoClicked'){
            await openTodo(message[1])
        } else if (message[0] == 'todoChecked'){
            await toggleTodoCompletion(message[1])
        }
    }        
    var htmlFilePath = (await joplin.plugins.installationDir()) + "/ui/panel/panel.html"
    baseHtml = await fs.readFile(htmlFilePath, 'utf8');
    panel = await joplin.views.panels.create('panel')
    await joplin.views.dialogs.addScript(panel, 'ui/panel/panel.js')
    await joplin.views.dialogs.addScript(panel, 'ui/panel/panel.css')
    await joplin.views.panels.onMessage(panel, panelEventHandler)
}

/** registerToggleVisibilityCommand *****************************************************************************************************************
 * Registers a toolbar button to toggle the panel visibility between shown and hidden                                                               *
 ***************************************************************************************************************************************************/
async function setupToolbarButton(){
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

/** updatePanelData *********************************************************************************************************************************
 * Displays all todos in the panel, grouped by date and sorted by time                                                                              *
 ***************************************************************************************************************************************************/
 export async function updatePanelData(todoHtml){
    var htmlString = baseHtml.replace("<<TODOS>>", todoHtml)    
    await joplin.views.panels.setHtml(panel, htmlString);
 }
