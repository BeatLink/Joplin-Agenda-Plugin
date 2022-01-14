/** Imports *****************************************************************************************************************************************/
import joplin from 'api';
import { setupCommands } from './logic/commands';
import { setupUpdater, updateInterfaces } from './logic/updater';
import { setupDatabase } from './storage/database/common';
import { setupProfileSettings } from './storage/settings/profile';
import { createMainPanel } from './ui/mainPanel/mainPanel';
import { setupMenu } from './ui/menus/menus';
import { setupProfileEditorDialog } from './ui/profileEditorDialog/profileEditorDialog';
import { setupToolbarButton } from './ui/toolbarButtons/toolbarButtons';

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
    await setupCommands()
    await setupUI()
    await setupProfileSettings()
    await setupUpdater()
    await updateInterfaces()
}

export async function setupUI(){
    await createMainPanel();
    await setupProfileEditorDialog()
    await setupToolbarButton()
    await setupMenu()
}