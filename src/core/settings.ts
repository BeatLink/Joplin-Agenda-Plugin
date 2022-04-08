/** README ******************************************************************************************************************************************
 * This file contains all functions related to settings configuration and management.																*
 ***************************************************************************************************************************************************/

/** Imports ****************************************************************************************************************************************/
import joplin from "api"
import { SettingItemType } from "api/types"
import { getAllProfiles, getProfile } from "./database"
import { setupTimer } from "./timer"

/** setupSettings ***********************************************************************************************************************************
 * Sets up the settings used by the plugin																											*
 ***************************************************************************************************************************************************/
export async function setupSettings(){
	await joplin.settings.registerSection(
		"section", {
			label: "Agenda",
			iconName: 'fas fa-calendar',
			description: "Settings for the Agenda Plugin",
			name: "agenda"
		})
	await joplin.settings.registerSettings({
		"currentProfileID": {
			label: "The ID of the current profile used by Agenda",
			value: null,
			type: SettingItemType.Int,
			public: false,
			section: 'section',
		},
		"showProfileControls": {
			label: "Show Profile Controls",
			value: true,
			type: SettingItemType.Bool,
			public: true,
			section: 'section',
		}, 
		"updateFrequency": {
			label: "How many seconds should agenda wait before updating the panel and notes",
			value: 10,
			type: SettingItemType.Int,
			public: true,
			section: 'section',
		},
		"moveDueDatesToEnd": {
			label: "Sort tasks without due dates at the end of the list",
			value: false,
			type: SettingItemType.Bool,
			public: true,
			section: 'section',
		}

	})
	await joplin.settings.onChange(setupTimer)
}

/** setCurrentProfileID *****************************************************************************************************************************
 * Saves the current profile ID to settings																											*
 ***************************************************************************************************************************************************/
export async function setCurrentProfileID(profileID){
	await joplin.settings.setValue("currentProfileID", profileID)
}

/** getCurrentProfileID *****************************************************************************************************************************
 * Gets the currently selected profile ID from settings and check that it is valid. If it empty or points to an invalid profile, the first profile	*
 * in the database is selected as the new current profile.																							*																									*
 ***************************************************************************************************************************************************/
export async function getCurrentProfileID(){
	var currentProfileID = await joplin.settings.value("currentProfileID")
	var currentProfile = await getProfile(currentProfileID)
	if (!currentProfile){
		currentProfileID = (await getAllProfiles())[0].id
		await setCurrentProfileID(currentProfileID)
	}
	return currentProfileID
}