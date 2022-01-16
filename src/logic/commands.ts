/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { toggleMainPanelVisibility } from "../ui/panel/panel";

/** setupCommands ***********************************************************************************************************************************
 * Sets up the commands used by the plugin                                                                                                          *
 ***************************************************************************************************************************************************/
export async function setupCommands(){
    await joplin.commands.register({
        name: 'agendaTogglePanelVisibility',
        label: 'Toggle Agenda Panel',
        iconName: 'fas fa-calendar',
        execute: toggleMainPanelVisibility
    });
}