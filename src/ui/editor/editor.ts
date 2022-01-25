import joplin from "api";
import { updateInterfaces } from "../../core/updater";
import { createRecord, deleteRecord, getRecord, updateRecord } from "../../core/database";
import { Profile } from "../../core/profile";
const fs = joplin.require('fs-extra');

var dialog = null;
var baseHtml = null

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

/** profileToString *********************************************************************************************************************************
 * Converts the given profile to a JSON string                                                                                                      *
 ***************************************************************************************************************************************************/
export function profileToString(profile){
    var profileObject = {
        "name": profile.name,
        "searchCriteria": profile.searchCriteria,
        "noteID": profile.noteID,
        "showCompleted": profile.showCompleted,
        "showNoDue": profile.showNoDue,
        "displayFormat": profile.displayFormat,
        "yearFormat": profile.yearFormat,
        "monthFormat": profile.monthFormat,
        "dayFormat": profile.dayFormat,
        "weekdayFormat": profile.weekdayFormat,
        "timeFormat": profile.timeIs12Hour
    }
    var profileString = JSON.stringify(profileObject)
    return btoa(profileString)
}

/** profileFromString *******************************************************************************************************************************
 * Returns a profile object from the given JSON string                                                                                              *
 ***************************************************************************************************************************************************/
export function profileFromString(profileString){
    var profileObject = JSON.parse(atob(profileString))
    var profile = new Profile()
    profile.name = profileObject["name"]
    profile.searchCriteria = profileObject["searchCriteria"]
    profile.noteID = profileObject["noteID"]
    profile.showCompleted = profileObject["showCompleted"]
    profile.showNoDue = profileObject["showNoDue"]
    profile.displayFormat = profileObject["displayFormat"]
    profile.yearFormat = profileObject["yearFormat"]
    profile.monthFormat = profileObject["monthFormat"]
    profile.dayFormat = profileObject["dayFormat"]
    profile.weekdayFormat = profileObject["weekdayFormat"]
    profile.timeIs12Hour = profileObject["timeFormat"]
    return profile
}

/** openDialog **************************************************************************************************************************************
 * Opens the recurrence dialog for the given noteID                                                                                                 *
 ***************************************************************************************************************************************************/
export async function openEditor(profileID?){
    if (profileID == undefined){
        profileID = await createRecord()
    }
    var profile = await getRecord(profileID) 
    var formattedHtml = baseHtml.replace("<<PROFILE_DATA>>", profileToString(profile))
    console.log(formattedHtml)
    await joplin.views.dialogs.setHtml(dialog, formattedHtml);
    var formResult = await joplin.views.dialogs.open(dialog)
    if (formResult.id == 'ok') {
        profile = profileFromString(formResult.formData["profileDataForm"]["profileData"])
        await updateRecord(profileID, profile)
    } else if (formResult.id == "delete") {
        await openDeleteConfirmation(profileID)
    }
}

export async function openDeleteConfirmation(profileID){
    var profile = await getRecord(profileID)
    var response = await joplin.views.dialogs.showMessageBox(`Delete ${profile.name}?`)
    if (response == 0) {
        await deleteRecord(profileID)
    }
}