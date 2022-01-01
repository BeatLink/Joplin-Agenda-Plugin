/** Imports *****************************************************************************************************************************************/
import joplin from 'api';
import { setupControls } from './core/controls';
import { createPanel, setupPanelUpdatePolling, updatePanelData } from './core/panel';
import { setupSettings } from './core/settings';

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
    await setupControls()
    await createPanel()
    await updatePanelData()
    await setupPanelUpdatePolling()
}