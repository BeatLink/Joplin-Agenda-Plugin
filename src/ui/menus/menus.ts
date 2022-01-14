import joplin from "api"
import { MenuItemLocation } from "api/types"
import { openProfilesDialog } from "../profileEditorDialog/profileEditorDialog"

/** setupMenu ***************************************************************************************************************************************
 * Sets up the menu used by the plugin                                                                                                              *
 ***************************************************************************************************************************************************/
 export async function setupMenu(){
    await joplin.commands.register({
        name: 'openProfilesDialog',
        label: 'Open Profiles Editor',
        iconName: 'fas fa-calendar',
        execute: openProfilesDialog
    })
    await joplin.views.menus.create(
        'agendaMenu', 
        "Agenda", 
        [{commandName: 'openProfilesDialog'}],
        MenuItemLocation.Tools
    )
}
