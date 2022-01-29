/** README ******************************************************************************************************************************************
 * This file is responsible for setting up and managing the buttons added to the toolbar                                                            *
 ***************************************************************************************************************************************************/

/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { ToolbarButtonLocation } from "api/types";

/** setupToolbar ************************************************************************************************************************************
 * Registers a toolbar button to toggle the panel visibility between shown and hidden                                                               *
 ***************************************************************************************************************************************************/
export async function setupToolbar() {
    await joplin.views.toolbarButtons.create(
        'togglePanelVisibilityButton',
        'togglePanelVisibility',
        ToolbarButtonLocation.NoteToolbar
    );
}
