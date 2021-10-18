/* Imports *******************************************************************************************************************************/
import joplin from 'api';
import { setupPanel } from '../GUI/Panel/Panel';
//import { setupDatabase, getRecord, updateRecord } from './database';
import { getSelectedNote } from './joplin';
import { reviewCompletedTasks } from './completion'


/* Main **********************************************************************************************************************************/
export async function main() {
    await console.info('Repeating To-Dos Plugin started!');             // Log startup to console
    //await setupDatabase();                                              // Setup Database
    await setupPanel();                                          // Setup Dialog Button
    await reviewCompletedTasks()                                         // Setup task completion logic
}
