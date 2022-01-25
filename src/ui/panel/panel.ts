/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { openTodo, toggleTodoCompletion } from "../../logic/joplin";
import { updateInterfaces } from "../../logic/updater";
import { IntervalFormat } from "../../logic/models/formats/interval";
import { DateFormat } from "../../logic/models/formats/date";
import { createRecord, deleteRecord, getAllRecords, getRecord } from "../../storage/database";
import { openEditor } from "../editor/editor";
import { Profile } from "../../logic/models/profile";
const fs = joplin.require('fs-extra');

/** Variable Declaration ***************************************************************************************************************************/
var baseHtml = "";
export var panel = null;


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



/** createPanel *************************************************************************************************************************************
 * Creates the panel in joplin and connects the evwent handler.                                                                                     *
 ***************************************************************************************************************************************************/
export async function setupPanel(){
    console.log("Setting up Panel")
    var htmlFilePath = (await joplin.plugins.installationDir()) + "/ui/panel/panel.html"
    baseHtml = await fs.readFile(htmlFilePath, 'utf8');
    panel = await joplin.views.panels.create('panel')
    await joplin.views.dialogs.addScript(panel, '/ui/panel/panel.js')
    await joplin.views.dialogs.addScript(panel, '/ui/panel/panel.css')
    console.log(htmlFilePath)
    await joplin.views.panels.onMessage(panel, eventHandler)
}

/** mainPanelEventHandler ***************************************************************************************************************************
 * Processes all events triggered by the panel's internal javascript                                                                                *
 ***************************************************************************************************************************************************/
async function eventHandler(message){
    if (message[0] == 'todoClicked'){
        await openTodo(message[1])
    } else if (message[0] == 'todoChecked'){
        await toggleTodoCompletion(message[1])
        await updateInterfaces()
    } else if (message[0] == 'profilesDropdownChanged'){
        await joplin.settings.setValue("currentProfileID", message[1])
        await updateInterfaces()
    } else if (message[0] == 'createProfileClicked'){
        var id = await createRecord()
        await openEditor(id)
        await updateInterfaces()    
    } else if (message[0] == 'editProfileClicked'){
        var id = await joplin.settings.value("currentProfileID")
        await openEditor(id)
        await updateInterfaces()
    } else if (message[0] == 'deleteProfileClicked'){
        var id = await joplin.settings.value("currentProfileID")
        await deleteRecord(id)
        await updateInterfaces()
    }
}    

/** toggleMainPanelVisibility ***********************************************************************************************************************
 * Toggles the main panel between shown and hidden                                                                                                  *
 ***************************************************************************************************************************************************/
export async function togglePanelVisibility() {
    var visibility = await joplin.views.panels.visible(panel);
    await joplin.views.panels.show(panel, !visibility);
}

export async function getProfilesHTML(){
    var htmlString = ""
    var allProfiles = await getAllRecords()
    var currentProfileID = await joplin.settings.value("currentProfileID")
    for (var id in allProfiles){
        var selected = id == currentProfileID ? "selected" : ""
        var profile = allProfiles[id]
        htmlString += `<option value="${id}" ${selected}>${profile.name}</option>`
    }
    return htmlString
}


/** updatePanelData *********************************************************************************************************************************
 * Displays all todos in the panel, grouped by date and sorted by time                                                                              *
 ***************************************************************************************************************************************************/
 export async function updatePanelData(){
    var formats = {
        'interval': IntervalFormat,
        'date': DateFormat,
    }
    var currentProfileID = await joplin.settings.value("currentProfileID")
    var currentProfile = await getRecord(currentProfileID)
    var profileEditMode = await joplin.settings.value("profileEditMode")
    var profilesList = await getProfilesHTML()
    var profile = currentProfile ? currentProfile : new Profile()
    var formatter = new formats[profile.displayFormat](profile)
    var todosHtml = await formatter.getTodos('html')
    var htmlStringWithProfileEditMode = baseHtml.replace("PROFILE_EDIT_MODE", profileEditMode)
    var htmlStringWithProfile = htmlStringWithProfileEditMode.replace("<<PROFILES_LIST>>", profilesList)
    var htmlString = htmlStringWithProfile.replace("<<TODOS>>", todosHtml)    
    await joplin.views.panels.setHtml(panel, htmlString);
 }
