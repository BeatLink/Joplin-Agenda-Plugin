/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { toggleProfileEditMode } from "./settings";
import { togglePanelVisibility } from "../ui/panel/panel";

/** setupCommands ***********************************************************************************************************************************
 * Sets up the commands used by the plugin                                                                                                          *
 ***************************************************************************************************************************************************/
export async function setupCommands(){
    console.info("Setting up Commands")
    await joplin.commands.register({
        name: 'agendaTogglePanelVisibility',
        label: 'Toggle Agenda Panel',
        iconName: 'fas fa-calendar',
        execute: togglePanelVisibility
    })
    await joplin.commands.register({
        name: 'toggleProfileEditMode',
        label: 'Toggle Profile Edit Mode',
        execute: toggleProfileEditMode
    })
}