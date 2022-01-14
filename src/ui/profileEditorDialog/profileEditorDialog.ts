import joplin from "api";
import { MenuItemLocation } from "api/types";
const fs = joplin.require('fs-extra');

var dialog = null;
var HTMLFilePath = null;
var BaseHTML = null


export async function setupProfilesDialog(){
    await setupMenu()
    await setupDialog()
}

/** setupMenu ***************************************************************************************************************************************
 * Sets up the menu used by the plugin                                                                                                              *
 ***************************************************************************************************************************************************/
export async function setupMenu(){
    await joplin.commands.register({
        name: 'openProfilesDialog',
        label: 'Open Profiles Editor',
        iconName: 'fas fa-calendar',
        execute: openProfilesDialog
    })
    await joplin.views.menus.create(
        'agendaMenu', 
        "Agenda", 
        [
            {commandName: 'openProfilesDialog'}
        ],
        MenuItemLocation.Tools
    )
}


/** createDialog ************************************************************************************************************************************
 * Initializes the recurrence dialog                                                                                                                *
 ***************************************************************************************************************************************************/
export async function setupDialog(){
    HTMLFilePath = (await joplin.plugins.installationDir()) + "/ui/profileEditorDialog/profileEditorDialog.html"
    BaseHTML = await fs.readFile(HTMLFilePath, 'utf8');
    dialog = await joplin.views.dialogs.create('dialog');
    await joplin.views.dialogs.setFitToContent(dialog, false)
    //await joplin.views.dialogs.addScript(dialog, './gui/dialog/dialog.js')
    //await joplin.views.dialogs.addScript(dialog, './gui/dialog/dialog.css')
}

/** openDialog **************************************************************************************************************************************
 * Opens the recurrence dialog for the given noteID                                                                                                 *
 ***************************************************************************************************************************************************/
export async function openProfilesDialog(recurrenceData){
    //var replacedHTML = BaseHTML.replace("RECURRENCE_DATA", btoa(recurrenceToJSON(recurrenceData)))
    await joplin.views.dialogs.setHtml(dialog, BaseHTML);
    var formResult = await joplin.views.dialogs.open(dialog)
    if (formResult.id == 'ok') {
        //return recurrenceFromJSON(atob(formResult.formData.recurrenceForm.recurrenceData))
    }
}

