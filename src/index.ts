/** Imports *****************************************************************************************************************************************/
import joplin from 'api'
import { setupCommands } from './logic/commands'
import { setupUpdater, updateInterfaces } from './logic/updater'
import { setupDatabase } from './storage/database'
import { setupSettings } from './storage/settings'
import { setupPanel } from './ui/panel/panel'
import { setupMenu } from './ui/menu/menu'
import { setupEditor } from './ui/editor/editor'
import { setupToolbar } from './ui/toolbar/toolbar'

/** Plugin Registration *****************************************************************************************************************************
 * Registers the plugin with joplin.                                                                                                                *
 ***************************************************************************************************************************************************/
joplin.plugins.register({ onStart: setupPlugin })

/** setupPlugin *************************************************************************************************************************************
 * Runs all functions to initialize the plugin                                                                                                      *
 ****************************************************************************************************************************************************/
 export async function setupPlugin(){
    await setupDatabase()
    await setupSettings()
    await setupCommands()
    await setupToolbar()
    await setupMenu()
    await setupPanel()
    await setupEditor()
    await setupUpdater()
    await updateInterfaces()
}