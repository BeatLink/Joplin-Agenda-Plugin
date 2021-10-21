/* Imports *****************************************************************************************************************************************/
import joplin from 'api';
import {SettingItemType, ToolbarButtonLocation } from 'api/types';
import { getTodos, openTodo, setupTaskChangeHandler, toggleToDoCompletion } from '../../Logic/joplin';

var panel = null;

/** setupPanel **************************************************************************************************************************************
 * Sets up the panel                                                                                                                                *
 ****************************************************************************************************************************************************/
export async function setupPanel(){
    async function createPanel(){
        panel = await joplin.views.panels.create('agendaPanel')
        await joplin.views.panels.onMessage(panel, panelEventHandler)
        await joplin.views.dialogs.addScript(panel, 'GUI/Panel/Panel.js')
        await joplin.views.dialogs.addScript(panel, 'GUI/Panel/Panel.css')

    }
    async function setupSettings(){
        await joplin.settings.registerSection("agenda", {
            name: "agendaSettingsSection",
            label: "Agenda",
            description: "Settings for the agenda Plugin",
            iconName: 'fas fa-calendar'
        })
        await joplin.settings.registerSettings({
            "agendaPanelVisibility": {
                label: "Agenda Panel Visibility",
                type: SettingItemType.Bool,
                value: true,
                public: false,
                section: "agenda"
            }}
        )
    }
    async function loadPanelVisibility(){
        await joplin.views.panels.show(panel, await joplin.settings.value('agendaPanelVisibility'))
    }
    async function registerCommands(){
        await joplin.commands.register({                        // Register the open panel dialog command
            name: 'toggleAgendaPanel',                          // Set the name of the command
            label: 'Toggle Agenda Panel',                       // Set the label for the command
            iconName: 'fas fa-calendar',                        // Set the icon for the command
            execute: togglePanelVisibility,
        });
    }
    async function createToolbarButton(){
        await joplin.views.toolbarButtons.create(                   // Creat the open dialog button and bind it to the command
            'toggleAgendaPanelButton',                           // The name of the button
            'toggleAgendaPanel',                                 // The above command to bind the button to
            ToolbarButtonLocation.NoteToolbar                       // The location of the new button (on the note toolbar)
        );
    }
                
    await createPanel()
    await setupSettings()
    await loadPanelVisibility()
    await registerCommands()
    await createToolbarButton()
    await updatePanelData()
    await setupTaskChangeHandler(updatePanelData)

}

/* togglePanelVisibility ****************************************************************************************************************************
Shows the panel if it is visible and vice versa
*/
async function togglePanelVisibility(){
    var visibility = await joplin.views.panels.visible(panel)
    await joplin.views.panels.show(panel, !visibility)
    await joplin.settings.setValue('agendaPanelVisibility', !visibility)
    await updatePanelData();
}

export async function updatePanelData(){   
    var HTMLString = ""
    for (var todoMap of (await getTodos()).entries()){
        HTMLString = HTMLString.concat(`<h2>${todoMap[0]}</h2>`)    
        for (var todo of todoMap[1]){
            HTMLString = HTMLString.concat(await getTodoHTML(todo))    
        }
    }
    const BaseHTML = await require('./Panel.html').default;
    var replacedHTML = BaseHTML.replace("<<TODOS>>", HTMLString)
    await joplin.views.panels.setHtml(panel, replacedHTML);
}

export async function getTodoHTML(todo){
    var date = new Date(todo.todo_due);
    var timeString = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
    var htmlTemplate = `
        <p>
            <input type="hidden" id="inputTaskID" value="${todo.id}">
            <input id="completedCheckbox" type="checkbox" onchange="onTodoChecked('${todo.id}')" ${todo.todo_completed == 1 ? "checked" : "" }>
            <label id="dueDate">${timeString}</label> - 
            <a id="taskTitle" href="#" onclick="onTodoClicked('${todo.id}')">${todo.title}</a>
        </p>
    `
    return htmlTemplate
}


export async function panelEventHandler(message){
    if (message[0] == 'todoClicked'){
        await openTodo(message[1])
    } else if (message[0] == 'todoChecked'){
        await toggleToDoCompletion(message[1])
        await updatePanelData()
    }
}
