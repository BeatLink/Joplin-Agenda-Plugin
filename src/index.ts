/** Imports *****************************************************************************************************************************************/
import joplin from 'api';
import { setupUpdater } from './logic/updater';
import { setupDatabase } from './storage/database/common';
import { setupPanel } from './ui/panel/panel';

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
    await setupDatabase()
    await setupPanel()
    await setupUpdater()
}