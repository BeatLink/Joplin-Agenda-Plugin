/** Imports ****************************************************************************************************************************************/
import joplin from "api"
import { SettingItemType } from "api/types"

/** setupSettings ***********************************************************************************************************************************
 * Sets up the settings used by the plugin																											*
 ***************************************************************************************************************************************************/
export async function setupSettings(){
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
