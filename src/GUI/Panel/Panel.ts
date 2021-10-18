/* Imports *****************************************************************************************************************************************/
import joplin from 'api';
import {SettingItemType, ToolbarButtonLocation } from 'api/types';

var panel = null;

/* setupPanel ***************************************************************************************************************************************
Sets up the schedule panel
*/
export async function setupPanel(){                 
    async function createPanel(){
        panel = await joplin.views.panels.create('SchedulePanel')
        await joplin.views.dialogs.addScript(panel, './GUI/Panel/Panel.js')
        await joplin.views.dialogs.addScript(panel, './GUI/Panel/Panel.css')
    
    }
    async function setupSettings(){
        await joplin.settings.registerSection("schedule", {
            name: "Settings",
            description: "settings for schedule",
            label: "Settings",
            iconName: 'fas fa-calendar'
        })
        await joplin.settings.registerSettings({
            "panel_visibility": {
                label: "Panel Visibility",
                type: SettingItemType.Bool,
                value: true,
                public: false,
                section: "schedule"
            }}
        )
    }
    async function loadPanelVisibility(){
        await joplin.views.panels.show(panel, await joplin.settings.value('panel_visibility'))
    
    }
    async function registerCommands(){
        await joplin.commands.register({                        // Register the open panel dialog command
            name: 'toggleSchedulePanel',                          // Set the name of the command
            label: 'Toggle Schedule Panel',                       // Set the label for the command
            iconName: 'fas fa-calendar',                        // Set the icon for the command
            execute: togglePanelVisibility,
        });
    }
    async function createToolbarButton(){
        await joplin.views.toolbarButtons.create(                   // Creat the open dialog button and bind it to the command
            'toggleSchedulePanelButton',                           // The name of the button
            'toggleSchedulePanel',                                 // The above command to bind the button to
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
    await joplin.settings.setValue('panel_visibility', !visibility)
}

export async function updatePanelData(){
    const PanelHTML = await require('./Panel.html').default;
   //var replacedHTML = DialogHTML.replace("RECURRENCE_DATA", btoa(recurrenceData.toJSON()))
    await joplin.views.dialogs.setHtml(panel, PanelHTML);
}





export async function toggleSchedulePanelSetting(){

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