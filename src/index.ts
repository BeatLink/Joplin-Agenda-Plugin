/** README ******************************************************************************************************************************************
 *  Agenda is a schedule/calendar panel for joplin that can show all to-dos in a chronological order.                                               *
 *  Via various built in formats and user creatable profiles, the to-do list presentation can be filtered and customized.                           *
 *  In addition to the panel, Agenda is capable of presenting the to-do list using individual notes.                                                *
 *  This alllows the to-do list to be accessed even without the agenda panel being available, such as on mobile                                     *
 ***************************************************************************************************************************************************/

/** Imports *****************************************************************************************************************************************/
import joplin from 'api'
import { setupCommands } from './core/commands'
import { setupRefresher, refreshInterfaces } from './core/refresher'
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
    await setupRefresher()
    await refreshInterfaces()
}