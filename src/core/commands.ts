/** README ******************************************************************************************************************************************
 * This file contains all of the plugin related commands.                                                                                          *
 ***************************************************************************************************************************************************/

/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { openStyler } from "../ui/styler/styler";
import { togglePanelVisibility, toggleShowProfileControls } from "../ui/panel/panel";

/** setupCommands ***********************************************************************************************************************************
 * Sets up the commands used by the plugin                                                                                                          *
 ***************************************************************************************************************************************************/
export async function setupCommands(){
    await joplin.commands.register({
        name: 'togglePanelVisibility',
        label: 'Toggle Agenda Panel',
        iconName: 'fas fa-calendar',
        execute: togglePanelVisibility
    })
    await joplin.commands.register({
        name: 'toggleShowProfileControls',
        label: 'Toggle Profile Edit Mode',
        execute: toggleShowProfileControls
    })
    await joplin.commands.register({
        name: 'showStylerDialog',
        label: 'Set Panel CSS',
        execute: openStyler
    })
}
