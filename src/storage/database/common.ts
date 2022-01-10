/** README ******************************************************************************************************************************************
 *                                                                                                                                                  * 
 *  This file contains all functions involved in managing the agenda profile database.                                                              *
 *  This sqlite3 database is stored in the plugin directory and holds all of the settings for each agenda profile.                                  *
 *                                                                                                                                                  *
 ***************************************************************************************************************************************************/

/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { createTable } from "./profile";
const fs = joplin.require('fs-extra')
const sqlite3 = joplin.require('sqlite3')

/** Variable Setup *********************************************************************************************************************************/
var databasePath = null
var database = null

/** setupDatabase ***********************************************************************************************************************************
 * Runs the code required for database initialization and record updates. This should run at  program start.                                        *
 ***************************************************************************************************************************************************/
export async function setupDatabase(){
    var pluginDir = await joplin.plugins.dataDir()
    databasePath = pluginDir + "/profiles.sqlite3"
    await fs.ensureDir(pluginDir)
    database = new sqlite3.Database(databasePath)
    await createTable()
}

/** runQuery ****************************************************************************************************************************************
 * Sqlite3 does not support async/await functionality, thus the need for this promise based function to run the sqlite functions. If there are      *
 * better ways to do this, please let me know                                                                                                       *
 ***************************************************************************************************************************************************/
export async function runQuery(func, SQLQuery, parameters): Promise<any>{
    return await new Promise(
        (resolve, reject) => {
            database[func](SQLQuery, parameters, (err, row) => { err ? reject(err) : resolve(row) })
        }
    )
}
