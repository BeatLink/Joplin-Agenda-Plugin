/** Imports ****************************************************************************************************************************************/
import joplin from "api"
import { SettingItemType } from "api/types"
import { getRecord } from "../../storage/database/profile"

/** setupProfileSettings ****************************************************************************************************************************
 * Sets up the settings option that stores the ID of the currently selected profile																	*
 ***************************************************************************************************************************************************/
export async function setupProfileSettings(){
    await joplin.settings.registerSettings({
		"currentProfileID": {
			label: "The ID of the current profile used by Agenda",
			value: null,
			type: SettingItemType.Int,
			public: false,
			section: 'section',
		}
	})
}
