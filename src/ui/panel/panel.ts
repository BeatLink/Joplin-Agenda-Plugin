/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { openTodo, toggleTodoCompletion } from "../../core/joplin";
import { updateInterfaces } from "../../core/updater";
import { IntervalFormat } from "../../core/formats/interval";
import { DateFormat } from "../../core/formats/date";
import { deleteRecord, getAllRecords, getRecord } from "../../core/database";
import { openDeleteConfirmation, openEditor } from "../editor/editor";
import { getCurrentProfileID, setCurrentProfileID } from "../../core/settings";
const fs = joplin.require('fs-extra');

/** Variable Declaration ***************************************************************************************************************************/
var panel = null;
var baseHtml = "";

/** createPanel *************************************************************************************************************************************
 * Creates the panel in joplin and connects the evwent handler.                                                                                     *
 ***************************************************************************************************************************************************/
export async function setupPanel(){
    panel = await joplin.views.panels.create('panel')
    baseHtml = await fs.readFile((await joplin.plugins.installationDir()) + "/ui/panel/panel.html");
    await joplin.views.dialogs.addScript(panel, '/ui/panel/panel.js')
    await joplin.views.dialogs.addScript(panel, '/ui/panel/panel.css')
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
        await setCurrentProfileID(message[1])
        await updateInterfaces()
    } else if (message[0] == 'createProfileClicked'){
        await openEditor()
        await updateInterfaces()    
    } else if (message[0] == 'editProfileClicked'){
        var id = await getCurrentProfileID()
        await openEditor(id)
        await updateInterfaces()
    } else if (message[0] == 'deleteProfileClicked'){
        var id = await getCurrentProfileID()
        await openDeleteConfirmation(id)
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
    var allProfiles = await getAllRecords()
    var currentProfileID = await getCurrentProfileID()
    var htmlString = ""
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
    var currentProfileID = await getCurrentProfileID()
    console.log(currentProfileID)
    var currentProfile = await getRecord(currentProfileID)
    console.log(currentProfile)
    var profileEditMode = await joplin.settings.value("profileEditMode")
    var profilesList = await getProfilesHTML()
    var profile = currentProfile ? currentProfile : getAllRecords()[0]
    var formatter = new formats[profile.displayFormat](profile)
    var todosHtml = await formatter.getTodos('html')
    var htmlStringWithProfileEditMode = baseHtml.replace("PROFILE_EDIT_MODE", profileEditMode)
    var htmlStringWithProfile = htmlStringWithProfileEditMode.replace("<<PROFILES_LIST>>", profilesList)
    var htmlString = htmlStringWithProfile.replace("<<TODOS>>", todosHtml)    
    await joplin.views.panels.setHtml(panel, htmlString);
 }
