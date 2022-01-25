import joplin from "api";
import { deleteRecord, getRecord } from "../../storage/database";
const fs = joplin.require('fs-extra');

var dialog = null;
var baseHtml = null

//view
//edit
//delete

//code function to create new profile
//code function to delete existing profile
//implement css for panel and profile editor

/** createDialog ************************************************************************************************************************************
 * Initializes the recurrence dialog                                                                                                                *
 ***************************************************************************************************************************************************/
export async function setupEditor(){
    console.info("Setting up Editor")
    var HTMLFilePath = (await joplin.plugins.installationDir()) + "/ui/editor/editor.html"
    baseHtml = await fs.readFile(HTMLFilePath, 'utf8');
    dialog = await joplin.views.dialogs.create('editor');
    await joplin.views.dialogs.setButtons(dialog, [
        {title: "Cancel", id: "cancel"},
        {title: "Delete", id: "delete"},
        {title: "Save", id: "ok"}
    ])
    await joplin.views.dialogs.addScript(dialog, '/ui/editor/editor.js')
    await joplin.views.dialogs.addScript(dialog, '/ui/editor/editor.css')
}

/** openDialog **************************************************************************************************************************************
 * Opens the recurrence dialog for the given noteID                                                                                                 *
 ***************************************************************************************************************************************************/
export async function openEditor(profileID){
    var profile = await getRecord(profileID) 
    var profileString = btoa(JSON.stringify(profile))
    var htmlWithProfileString = baseHtml.replace("<<PROFILE_DATA>>", profileString)
    await joplin.views.dialogs.setHtml(dialog, htmlWithProfileString);
    var formResult = await joplin.views.dialogs.open(dialog)
    if (formResult.id == 'ok') {
        // save profile data
        //return recurrenceFromJSON(atob(formResult.formData.recurrenceForm.recurrenceData))
    } else if (formResult.id == "delete") {
        deleteRecord(profileID)
    }
}

