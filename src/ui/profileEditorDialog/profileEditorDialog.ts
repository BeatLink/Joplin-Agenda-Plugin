import joplin from "api";
import { getProfilesHTML } from "../../logic/models/profile";
const fs = joplin.require('fs-extra');

var dialog = null;
var baseHtml = null

//create
//view
//edit
//delete


//load all profiles
//code function to switch profile on dropdown changes
//code function to update existing profile
//code function to create new profile
//code function to delete existing profile
//implement css for panel and profile editor

/** createDialog ************************************************************************************************************************************
 * Initializes the recurrence dialog                                                                                                                *
 ***************************************************************************************************************************************************/
export async function setupProfileEditorDialog(){
    var HTMLFilePath = (await joplin.plugins.installationDir()) + "/ui/profileEditorDialog/profileEditorDialog.html"
    baseHtml = await fs.readFile(HTMLFilePath, 'utf8');
    dialog = await joplin.views.dialogs.create('dialog');
    await joplin.views.dialogs.setButtons(dialog, [
        {title: "Close", id: "cancel"},
        {title: "Delete", id: "delete"},
        {title: "Save", id: "ok"}
    ])
    //await joplin.views.dialogs.addScript(dialog, './gui/dialog/dialog.js')
    //await joplin.views.dialogs.addScript(dialog, './gui/dialog/dialog.css')
}

/** openDialog **************************************************************************************************************************************
 * Opens the recurrence dialog for the given noteID                                                                                                 *
 ***************************************************************************************************************************************************/
export async function openProfilesDialog(){
    //var replacedHTML = BaseHTML.replace("RECURRENCE_DATA", btoa(recurrenceToJSON(recurrenceData)))
    var profilesList = await getProfilesHTML()
    var htmlStringWithProfile = baseHtml.replace("<<PROFILES_LIST>>", profilesList)

    await joplin.views.dialogs.setHtml(dialog, htmlStringWithProfile);
    var formResult = await joplin.views.dialogs.open(dialog)
    if (formResult.id == 'ok') {
        //return recurrenceFromJSON(atob(formResult.formData.recurrenceForm.recurrenceData))
    } else if (formResult.id == "delete") {
        //delete
    }
}

