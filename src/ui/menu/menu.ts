/** README ******************************************************************************************************************************************
 * This file is responsible for setting up and managing the menus for the plugin                                                                    *
 ***************************************************************************************************************************************************/

/** Imports ****************************************************************************************************************************************/
import joplin from "api"
import { MenuItemLocation } from "api/types"

/** setupMenu ***************************************************************************************************************************************
 * Sets up the menu used by the plugin                                                                                                              *
 ***************************************************************************************************************************************************/
 export async function setupMenu(){
    await joplin.views.menus.create(
        'agendaMenu', 
        "Agenda", 
        [
            {commandName: 'togglePanelVisibility'},
            {commandName: 'toggleShowProfileControls'},
            {commandName: 'showStylerDialog'},            
        ],
        MenuItemLocation.Tools
    )
}
