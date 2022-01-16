import joplin from "api";
import { ToolbarButtonLocation } from "api/types";

/** registerToggleVisibilityCommand *****************************************************************************************************************
 * Registers a toolbar button to toggle the panel visibility between shown and hidden                                                               *
 ***************************************************************************************************************************************************/
export async function setupToolbarButton() {
    await joplin.views.toolbarButtons.create(
        'agendaTogglePanelVisibilityButton',
        'agendaTogglePanelVisibility',
        ToolbarButtonLocation.NoteToolbar
    );
}
