import joplin from "api"
import { getRecord } from "../../storage/database/profile"

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