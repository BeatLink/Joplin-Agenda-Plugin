/* Imports *****************************************************************************************************************************************/
import joplin from 'api';
import {SettingItemType, ToolbarButtonLocation } from 'api/types';
import { getTodos } from '../../Logic/joplin';

var panel = null;

/* setupPanel ***************************************************************************************************************************************
Sets up the panel
*/
export async function setupPanel(){                 
    async function createPanel(){
        panel = await joplin.views.panels.create('agendaPanel')
        //await joplin.views.dialogs.addScript(panel, './GUI/Panel/Panel.js')
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
            <input id="completedCheckbox" type="checkbox">
            <label id="dueDate">${timeString}</label> - 
            <a id="taskTitle" href="#" onclick="onTaskClicked(${todo.id})">${todo.title}</a>
        </p>
    `
    return htmlTemplate
}



export async function togglePanelSetting(){

    //var selectedNote = await getSelectedNote()                          // Get current note
    //var selectedNoteID = selectedNote.id                                // Get ID of selected note
    //var oldRecurrence = await getRecord(selectedNoteID)       // Get recurrence data for current note
    var newRecurrence = await openDialog();        // Load recurrence data into recurrence dialog, Open recurrence dialog and save new recurrence
    /*if (newRecurrence){
        await updateRecord(selectedNoteID, newRecurrence)
    }*/
}



export async function openDialog(){
    /*
    await setRecurrence(recurrenceData)                          // load recurrence into dialog
    var formResult = await joplin.views.dialogs.open(dialog);             // Show Dialog
    return await getRecurrence(formResult)
    */
}
/*

async function getRecurrence(formResult){
    if (formResult.id == 'ok') {
        var encodedRecurrenceData = formResult.formData.recurrenceForm.recurrenceData                   // gets the encoded recurrence data from the hidden form
        var decodedRecurrenceData = atob(encodedRecurrenceData)             // decodes the recurrence data into the json string
        var recurrence = new Recurrence()
        recurrence.fromJSON(decodedRecurrenceData)
        return recurrence
    }
}
*/