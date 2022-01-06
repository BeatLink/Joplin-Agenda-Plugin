/** Imports *****************************************************************************************************************************************/
import joplin from 'api';
import { setupControls } from './gui/controls';
import { createPanel, setupPanelUpdatePolling, updatePanelData } from './gui/panel';
import { setupSettings } from './core/settings';
import { loadDateSettings } from './core/date-formats';

/** Plugin Registration *****************************************************************************************************************************
 * Registers the plugin with joplin.                                                                                                                *
 ***************************************************************************************************************************************************/
joplin.plugins.register({
    onStart: setupPlugin
});

/** setupPlugin *************************************************************************************************************************************
 * Runs all functions to initialize the plugin                                                                                                      *
 ****************************************************************************************************************************************************/
 export async function setupPlugin(){
    await setupSettings()
    await loadDateSettings()
    await setupControls()
    await createPanel()
    await updatePanelData()
    await setupPanelUpdatePolling()
    await joplin.workspace.onNoteChange(updatePanelData)
}