/* Imports *****************************************************************************************************************************************/
import joplin from 'api';
import {MenuItemLocation, SettingItemType, ToolbarButtonLocation } from 'api/types';
import { connectNoteChangedCallback, getTodos, openTodo, toggleTodoCompletion as toggleTodoCompletion } from '../../Logic/joplin';

var panel = null;


/** setupPlugin *************************************************************************************************************************************
 * Runs all functions to initialize the plugin                                                                                                                              *
 ****************************************************************************************************************************************************/
export async function setupPlugin(){                
    await createPanel()
    await setupSettings()
    await setupCommands()
    await setupControls()
    await updatePanelData()
    await connectNoteChangedCallback(updatePanelData)
}


/** setupPanel **************************************************************************************************************************************
 * Sets up the panel                                                                                                                                *
 ****************************************************************************************************************************************************/
async function createPanel(){
    panel = await joplin.views.panels.create('panel')
    await joplin.views.dialogs.addScript(panel, 'GUI/Panel/Panel.js')
    await joplin.views.dialogs.addScript(panel, 'GUI/Panel/Panel.css')
    await joplin.views.panels.onMessage(panel, async (message) => {
        if (message[0] == 'todoClicked'){
            await openTodo(message[1])
        } else if (message[0] == 'todoChecked'){
            await toggleTodoCompletion(message[1])
            await updatePanelData()
        }
    })
}


/** setupSettings ***********************************************************************************************************************************
 * Registers the settings for the plugin                                                                                                            *
 ***************************************************************************************************************************************************/
async function setupSettings(){
    await joplin.settings.registerSection("settingsSection", {
        label: "Agenda",
        description: "Agenda Plugin Settings",
        iconName: 'fas fa-calendar'
    })
    await joplin.settings.registerSettings({
        "panelVisibility": {
            label: "Show Agenda Panel",
            type: SettingItemType.Bool,
            value: true,
            public: true,
            section: "settingsSection"
        },
        "showCompletedTodos": {
            label: "Show Completed To-Dos",
            type: SettingItemType.Bool,
            value: true,
            public: true,
            section: "settingsSection"
        },
        "showNoDueDateTodos": {
            label: "Show To-Dos without Due Date",
            type: SettingItemType.Bool,
            value: true,
            public: true,
            section: "settingsSection"
        }
    })
}


/** setupCommands ***********************************************************************************************************************************
 * Registers the commands for the plugin                                                                                                            *
 ***************************************************************************************************************************************************/
async function setupCommands(){
    await joplin.commands.register({ 
        name: 'togglePanelVisibility',                       
        label: 'Toggle Agenda Panel',                     
        iconName: 'fas fa-calendar',                  
        execute: async () => {
            var visibility = await joplin.settings.value('panelVisibility')
            await joplin.settings.setValue('panelVisibility', !visibility)
            await updatePanelData();        
        },
    });
    await joplin.commands.register({                       
        name: 'toggleShowCompletedTodos',                  
        label: 'Show Completed To-Dos',                    
        iconName: 'fas fa-calendar',                       
        execute: async () => {
            var showCompletedTodos = await joplin.settings.value('showCompletedTodos')
            await joplin.settings.setValue('showCompletedTodos', !showCompletedTodos)
        },
    });
    await joplin.commands.register({
        name: 'toggleShowNoDueDateTodos',
        label: 'Show To-Dos without Due Date', 
        iconName: 'fas fa-calendar', 
        execute: async () => {
            var showNoDueDateTodos = await joplin.settings.value('showNoDueDateTodos')
            await joplin.settings.setValue('showNoDueDateTodos', !showNoDueDateTodos)
        },
    });
    joplin.settings.onChange(updatePanelData)
}


/** setupControls ***********************************************************************************************************************************
 * Sets up the toolbar buttons and menus for the plugin                                                                                             *
 ***************************************************************************************************************************************************/
async function setupControls(){
    await joplin.views.toolbarButtons.create( 
        'togglePanelVisibilityButton',
        'togglePanelVisibility',
        ToolbarButtonLocation.NoteToolbar
    );
    await joplin.views.menus.create("menu", "Agenda", [
            {label: "Show Completed Todos", commandName: 'toggleShowCompletedTodos'}, 
            {label: "Show To-Dos without Due Dates", commandName: 'toggleShowNoDueDateTodos'}
        ], MenuItemLocation.Tools
    )
}


/** updatePanelData *********************************************************************************************************************************
 * Displays all todos in the panel, grouped by date and sorted by time                                                                              *
 ***************************************************************************************************************************************************/
export async function updatePanelData(){  
    var visibility = await joplin.settings.value('panelVisibility')
    await joplin.views.panels.show(panel, visibility) 
    if (visibility){
        var allTodosHTMLString = ""
        var allTodos = (await getTodos()).entries()
        for (var date of allTodos){
            allTodosHTMLString = allTodosHTMLString.concat(`<h2 class="agendaDate">${date[0]}</h2>`)    
            for (var todo of date[1]){
                var dueDate = new Date(todo.todo_due)
                var dueString = todo.todo_due != 0 ? dueDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}).concat(" - ") : ""
                var checkedString = todo.todo_completed != 0 ? "checked" : "" 
                var todoHTMLString = `
                    <p class="agendaTodo">
                        <input class="agendaTodoCheckbox" type="checkbox" onchange="onTodoChecked('${todo.id}')" ${checkedString}>
                        <label class="agendaTodoTime">${dueString}</label>
                        <a class="agendaTodoTitle" href="#" onclick="onTodoClicked('${todo.id}')">${todo.title}</a>
                    </p>
                `
                allTodosHTMLString = allTodosHTMLString.concat(todoHTMLString)    
            }
        }
        const BaseHTML = await require('./Panel.html').default;
        var replacedHTML = BaseHTML.replace("<<TODOS>>", allTodosHTMLString)
        await joplin.views.panels.setHtml(panel, replacedHTML);
    }
}
