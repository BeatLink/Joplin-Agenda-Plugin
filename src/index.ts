/** Imports *****************************************************************************************************************************************/
import joplin from 'api'
import { setupCommands } from './core/commands'
import { setupUpdater, updateInterfaces } from './core/updater'
import { setupDatabase } from './core/database'
import { setupSettings } from './core/settings'
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