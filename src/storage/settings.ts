/** Imports ****************************************************************************************************************************************/
import joplin from "api"
import { SettingItemType } from "api/types"
import { updateInterfaces } from "../logic/updater"

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