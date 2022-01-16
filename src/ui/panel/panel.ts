/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { getCurrentProfile, getProfilesHTML, Profile, setCurrentProfile } from "../../logic/models/profile";
import { openTodo, toggleTodoCompletion } from "../../logic/joplin";
import { updateInterfaces } from "../../logic/updater";
import { getAllRecords } from "../../storage/database";
import { IntervalFormat } from "src/logic/models/formats/interval";
import { DateFormat } from "src/logic/models/formats/date";
const fs = joplin.require('fs-extra');

/** Variable Declaration ***************************************************************************************************************************/
var baseHtml = "";
export var mainPanel = null;


/** createPanel *************************************************************************************************************************************
 * Creates the panel in joplin and connects the evwent handler.                                                                                     *
 ***************************************************************************************************************************************************/
export async function setupPanel(){
    var htmlFilePath = (await joplin.plugins.installationDir()) + "/ui/mainPanel/mainPanel.html"
    baseHtml = await fs.readFile(htmlFilePath, 'utf8');
    mainPanel = await joplin.views.panels.create('mainPanel')
    await joplin.views.dialogs.addScript(mainPanel, 'ui/mainPanel/mainPanel.js')
    await joplin.views.dialogs.addScript(mainPanel, 'ui/mainPanel/mainPanel.css')
    await joplin.views.panels.onMessage(mainPanel, mainPanelEventHandler)
}

/** mainPanelEventHandler ***************************************************************************************************************************
 * Processes all events triggered by the panel's internal javascript                                                                                *
 ***************************************************************************************************************************************************/
async function mainPanelEventHandler(message){
    if (message[0] == 'todoClicked'){
        await openTodo(message[1])
    } else if (message[0] == 'todoChecked'){
        await toggleTodoCompletion(message[1])
        await updateInterfaces()
    } else if (message[0] == 'profilesDropdownChanged'){
        await setCurrentProfile(message[1])
        await updateInterfaces()
    }
}    

/** toggleMainPanelVisibility ***********************************************************************************************************************
 * Toggles the main panel between shown and hidden                                                                                                  *
 ***************************************************************************************************************************************************/
export async function toggleMainPanelVisibility() {
    var visibility = await joplin.views.panels.visible(mainPanel);
    await joplin.views.panels.show(mainPanel, !visibility);
}


/** updatePanelData *********************************************************************************************************************************
 * Displays all todos in the panel, grouped by date and sorted by time                                                                              *
 ***************************************************************************************************************************************************/
 export async function updatePanelData(){
    var formats = {
        'interval': IntervalFormat,
        'date': DateFormat,
    }

    var currentProfile = await getCurrentProfile()
    var profilesList = await getProfilesHTML()
    var profile = currentProfile ? currentProfile : new Profile()
    var formatter = new formats[profile.displayFormat](profile)
    var todosHtml = await formatter.getTodos('html')
    var htmlStringWithProfile = baseHtml.replace("<<PROFILES_LIST>>", profilesList)
    var htmlString = htmlStringWithProfile.replace("<<TODOS>>", todosHtml)    
    await joplin.views.panels.setHtml(mainPanel, htmlString);
 }
