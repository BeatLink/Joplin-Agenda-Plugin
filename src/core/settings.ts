/** Imports ****************************************************************************************************************************************/
import joplin from "api"
import { SettingItemType } from "api/types"
import { Profile } from "./profile"
import { updateInterfaces } from "./updater"
import { createRecord, getAllRecords, getRecord } from "./database"

/** setupSettings ***********************************************************************************************************************************
 * Sets up the settings used by the plugin																											*
 ***************************************************************************************************************************************************/
export async function setupSettings(){
	console.info("Setting up Settings")
    await joplin.settings.registerSettings({
		"currentProfileID": {
			label: "The ID of the current profile used by Agenda",
			value: null,
			type: SettingItemType.Int,
			public: false,
			section: 'section',
		}
	})
	await joplin.settings.registerSettings({
		"profileEditMode": {
			label: "Enable profile management controls",
			value: 'flex',
            options: {
                'flex': 'Show',
                'none': 'Hide',
            },
            isEnum: true,
			type: SettingItemType.String,
			public: true,
			section: 'section',
		}
	})
}

export async function toggleProfileEditMode() {
	var editMode = await joplin.settings.value("profileEditMode")
	var newMode = editMode == "flex" ? "none" : "flex"
	await joplin.settings.setValue("profileEditMode", newMode)
	await updateInterfaces()
}

export async function setCurrentProfileID(id){
	await joplin.settings.setValue("currentProfileID", id)
}

//get current id, if not set to profile, get first profile in all records. If no profile in records, create one. 
export async function getCurrentProfileID(){
	var currentID = await joplin.settings.value("currentProfileID")
	if (await getRecord(currentID) == undefined){
		var allProfileIDs = Object.keys(await getAllRecords())
		currentID = allProfileIDs.length < 1 ? await createRecord(new Profile()) :  allProfileIDs[0]
		await setCurrentProfileID(currentID)
	}
	return currentID
}

