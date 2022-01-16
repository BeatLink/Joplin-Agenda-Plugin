import joplin from "api"
import { getAllRecords, getRecord } from "../../storage/database"

/** Profile *****************************************************************************************************************************************
 * This data class represents a specific Agenda profile that customizes the presentation of the panels and notes                                    *
 ***************************************************************************************************************************************************/
export class Profile {
    public name = 'New Profile'
    public searchCriteria = ''
    public noteID = ""
    public showCompleted = false
    public showNoDue = false
    public displayFormat = 'interval'
    public yearFormat = 'numeric'
    public monthFormat = 'long'
    public dayFormat = 'numeric'
    public weekdayFormat = 'long'
    public timeIs12Hour = true
}

/** getCurrentProfile *******************************************************************************************************************************
 * Gets the currently selected profile                                                                                                              *
 ***************************************************************************************************************************************************/
export async function getCurrentProfile(){
    var currentProfileID = await joplin.settings.value("currentProfileID")
	var currentProfile = await getRecord(currentProfileID)
    return currentProfile
}

export async function setCurrentProfile(profileID){
    await joplin.settings.setValue('currentProfileID', profileID)
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

