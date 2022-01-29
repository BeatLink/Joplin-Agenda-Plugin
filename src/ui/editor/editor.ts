/** README ******************************************************************************************************************************************
 * The profile editor dialog allows the user to edit the profile settings and customizations as well as to delete the profile                       *
 ***************************************************************************************************************************************************/

/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { deleteProfile, getAllProfiles, getProfile, updateProfile } from "../../core/database";
const fs = joplin.require('fs-extra');

/** Variable Setup *********************************************************************************************************************************/
var dialog = null;
var baseHtml = null

/** setupEditor *************************************************************************************************************************************
 * Initializes the profile editor dialog                                                                                                            *
 ***************************************************************************************************************************************************/
export async function setupEditor(){
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

/** openEditor **************************************************************************************************************************************
 * Opens the profile editor dialog for the given profile ID. If Save is clicked, the changes are saved to the database. IF delete is clicked, the   *
 * delete confirmation dialog is opened                                                                                                             *
 ***************************************************************************************************************************************************/
export async function openEditor(profileID){
    var profile = await getProfile(profileID)
    var formattedHtml = baseHtml.replace("<<PROFILE_DATA>>", btoa(JSON.stringify(profile)))
    await joplin.views.dialogs.setHtml(dialog, formattedHtml);
    var formResult = await joplin.views.dialogs.open(dialog)
    if (formResult.id == 'ok') {
        profile = JSON.parse(atob(formResult.formData["profileDataForm"]["profileData"]))
        await updateProfile(profileID, profile)
    } else if (formResult.id == "delete") {
        await openDeleteDialog(profileID)
    }    
}

/** openDeleteDialog ********************************************************************************************************************************
 * Opens a confirmation dialog to confirm the deletion of a profile. If OK is clicked, the profile is deleted from the database                     *
 ***************************************************************************************************************************************************/
export async function openDeleteDialog(profileID){
    if ((await getAllProfiles()).length > 1){
        var profile = await getProfile(profileID)
        var response = await joplin.views.dialogs.showMessageBox(`Delete ${profile.name}?`)
        if (response == 0) {
            await deleteProfile(profileID)
        }    
    } else {
        await joplin.views.dialogs.showMessageBox(`Unable to Delete: At least 1 profile must exist in database.`)
    }

}