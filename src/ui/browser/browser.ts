import joplin from "api";
import { getAllRecords } from "../../storage/database";
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
export async function setupBrowser(){
    var HTMLFilePath = (await joplin.plugins.installationDir()) + "/ui/profileEditorDialog/profileEditorDialog.html"
    baseHtml = await fs.readFile(HTMLFilePath, 'utf8');
    dialog = await joplin.views.dialogs.create('dialog');
    await joplin.views.dialogs.setButtons(dialog, [
        {title: "Close", id: "cancel"},
        {title: "Delete", id: "delete"},
        {title: "Save", id: "ok"}
    ])
    await joplin.views.dialogs.addScript(dialog, '/ui/profileEditorDialog/profileEditorDialog..js')
    await joplin.views.dialogs.addScript(dialog, '/ui/profileEditorDialog/profileEditorDialog..css')
}

/** openDialog **************************************************************************************************************************************
 * Opens the recurrence dialog for the given noteID                                                                                                 *
 ***************************************************************************************************************************************************/
export async function openBrowser(){
    var profilesList = await getProfilesHTML()
    var allProfiles = await getAllRecords()
    var allProfilesSerialized = btoa(JSON.stringify(allProfiles))
    var htmlWithProfiles = baseHtml.replace("<<PROFILES_DATA>>", allProfilesSerialized)
    var htmlStringWithProfile = htmlWithProfiles.replace("<<PROFILES_LIST>>", profilesList)
    await joplin.views.dialogs.setHtml(dialog, htmlStringWithProfile);
    var formResult = await joplin.views.dialogs.open(dialog)
    if (formResult.id == 'ok') {
        //return recurrenceFromJSON(atob(formResult.formData.recurrenceForm.recurrenceData))
    } else if (formResult.id == "delete") {
        //delete
    }
}

