/** Imports *****************************************************************************************************************************************/
import joplin from 'api';
import { setupCommands } from './logic/commands';
import { setupUpdater, updateInterfaces } from './logic/updater';
import { setupDatabase } from './storage/database/common';
import { createRecord } from './storage/database/profile';
import { setupProfileSettings } from './storage/settings/profile';
import { createMainPanel } from './ui/mainPanel/mainPanel';
import { setupProfilesDialog } from './ui/profileEditorDialog/profileEditorDialog';
import { createProfileSelectorDialog } from './ui/profileSelectorDialog/profileSelectorDialog';
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
    await setupToolbarButton()
    await setupProfilesDialog()
}