/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { openTodo, toggleTodoCompletion } from "../../core/joplin";
import { refreshInterfaces } from "../../core/refresher";
import { getAllProfiles, getProfile } from "../../core/database";
import { openDeleteDialog, openEditor } from "../editor/editor";
import { formats } from "../../core/formats";
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
    baseHtml = await fs.readFile((await joplin.plugins.installationDir()) + "/ui/panel/panel.html", "utf-8");
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
        await refreshInterfaces()
    } else if (message[0] == 'profilesDropdownChanged'){
        await setCurrentProfileID(message[1])
        await refreshInterfaces()
    } else if (message[0] == 'createProfileClicked'){
        await openEditor()
        await refreshInterfaces()    
    } else if (message[0] == 'editProfileClicked'){
        var id = await getCurrentProfileID()
        await openEditor(id)
        await refreshInterfaces()
    } else if (message[0] == 'deleteProfileClicked'){
        var id = await getCurrentProfileID()
        await openDeleteDialog(id)
        await refreshInterfaces()
    }
}    

/** toggleMainPanelVisibility ***********************************************************************************************************************
 * Toggles the main panel between shown and hidden                                                                                                  *
 ***************************************************************************************************************************************************/
export async function togglePanelVisibility() {
    var visibility = await joplin.views.panels.visible(panel);
    await joplin.views.panels.show(panel, !visibility);
}

/** toggleShowProfileControls ***********************************************************************************************************************
 * Toggles between showing and hiding the profile editor buttons (create, edit and delte profile) on the main panel									*
 ***************************************************************************************************************************************************/
 export async function toggleShowProfileControls() {
	var showProfileControls = await joplin.settings.value("showProfileControls")
	await joplin.settings.setValue("showProfileControls", !showProfileControls)
	await refreshPanelData()
}

/** refreshPanelData ********************************************************************************************************************************
 * Displays all todos in the panel, according to the formatting specified by the profile and format                                                 *
 ***************************************************************************************************************************************************/
 export async function refreshPanelData(){
    var profileID = await getCurrentProfileID()
    var profile = await getProfile(profileID)
    var htmlString = baseHtml
    htmlString = htmlString.replace("<<PROFILE_CONTROLS>>", await getProfileControlsHTML())
    var formatter = new formats[profile.displayFormat](profile, 'html')
    var todosHtml = await formatter.getTodos()
    var htmlString = htmlString.replace("<<TODOS>>", todosHtml)
    await joplin.views.panels.setHtml(panel, htmlString);    
}

/** getProfileControlsHTML **************************************************************************************************************************
 * Returns a string representing the HTML containing the profile dropdown and the create, edit and delete buttons                                   *
 ***************************************************************************************************************************************************/
async function getProfileControlsHTML(){
    var htmlString = `    
        <section id="profileControls">
            <select id="profileDropdown" onchange="onProfilesDropdownChanged(this.value)">
                <<PROFILES_LIST>>
            </select>
            <section id=profileButtonsSection style="display: <<SHOW_PROFILE_CONTROLS>>;">
                <i class="fa fa-plus" title="Create New Profile" aria-hidden="true" onclick="onCreateProfileClicked()"></i>
                <i class="fa fa-edit" title="Edit Profile" aria-hidden="true" onclick="onEditProfileClicked()"></i>
                <i class="fa fa-trash" title="Delete Profile" aria-hidden="true" onclick="onDeleteProfileClicked()"></i>        
            </section>
        </section>
    `
    var showProfileControls = await joplin.settings.value("showProfileControls")
    var htmlString = htmlString.replace("<<SHOW_PROFILE_CONTROLS>>", showProfileControls == true ? "flex" : "none")
    var currentProfileID = await getCurrentProfileID()
    var profileListString = ""
    for (var profile of await getAllProfiles()){
        var selected = currentProfileID && currentProfileID == profile.id ? "selected" : ""
        profileListString += `<option value="${profile.id}" ${selected}>${profile.name}</option>`
    }
    var htmlString = htmlString.replace("<<PROFILES_LIST>>", profileListString)
    return htmlString
}
