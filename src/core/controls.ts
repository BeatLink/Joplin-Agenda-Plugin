import joplin from "api";
import { ToolbarButtonLocation, MenuItemLocation } from "api/types";
import { updatePanelData } from "./panel";

/** setupCommands ***********************************************************************************************************************************
 * Registers the commands for the plugin                                                                                                            *
 ***************************************************************************************************************************************************/
async function setupCommands(){
    await joplin.commands.register({ 
        name: 'agendaTogglePanelVisibility',                       
        label: 'Toggle Agenda Panel',                     
        iconName: 'fas fa-calendar',                  
        execute: async () => {
            var visibility = await joplin.settings.value('agendaPanelVisibility')
            await joplin.settings.setValue('agendaPanelVisibility', !visibility)
            await updatePanelData();        
        },
    });
    await joplin.commands.register({                       
        name: 'agendaToggleShowCompletedTodos',                  
        label: 'Show Completed To-Dos',                    
        iconName: 'fas fa-calendar',                       
        execute: async () => {
            var showCompletedTodos = await joplin.settings.value('agendaShowCompletedTodos')
            await joplin.settings.setValue('agendaShowCompletedTodos', !showCompletedTodos)
        },
    });
    await joplin.commands.register({
        name: 'agendaToggleShowNoDueDateTodos',
        label: 'Show To-Dos without Due Date', 
        iconName: 'fas fa-calendar', 
        execute: async () => {
            var showNoDueDateTodos = await joplin.settings.value('agendaShowNoDueDateTodos')
            await joplin.settings.setValue('agendaShowNoDueDateTodos', !showNoDueDateTodos)
        },
    });
}

/** setupMenu ***************************************************************************************************************************************
 * Creates the menu for the plugin                                                                                                                  *
 ***************************************************************************************************************************************************/
async function setupMenu(){
    await joplin.views.menus.create(
        "agendaMenu", 
        "Agenda", 
        [
            {label: "Show Completed Todos", commandName: 'agendaToggleShowCompletedTodos'}, 
            {label: "Show To-Dos without Due Dates", commandName: 'agendaToggleShowNoDueDateTodos'}
        ], 
        MenuItemLocation.View
    )
}

/** setupToolbarButton ******************************************************************************************************************************
 * Creates the toolbar button for the plugin                                                                                                        *
 ***************************************************************************************************************************************************/
async function setupToolbarButton(){
    await joplin.views.toolbarButtons.create( 
        'agendaTogglePanelVisibilityButton',
        'agendaTogglePanelVisibility',
        ToolbarButtonLocation.NoteToolbar
    );
}

/** setupControls ***********************************************************************************************************************************
 * Sets up all toolbar buttons and menus for the plugin                                                                                             *
 ***************************************************************************************************************************************************/
export async function setupControls(){
    await setupCommands();
    await setupMenu();
    await setupToolbarButton();
}