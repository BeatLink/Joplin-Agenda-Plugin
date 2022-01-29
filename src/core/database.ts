/** README ******************************************************************************************************************************************
 * This file contains all functions involved in managing the agenda profile database.                                                               *
 * This sqlite3 database is stored in the plugin directory and holds all of the settings for each agenda profile.                                   *
 ***************************************************************************************************************************************************/

/** Imports ****************************************************************************************************************************************/
import joplin from "api";
const fs = joplin.require('fs-extra')
const sqlite3 = joplin.require('sqlite3')

/** Variable Setup *********************************************************************************************************************************/
var database = null

/** runQuery ****************************************************************************************************************************************
 * Sqlite3 does not support async/await functionality, thus the need for this promise based function to run the sqlite functions. If there are      *
 * better ways to do this, please let me know                                                                                                       *
 ***************************************************************************************************************************************************/
async function runQuery(func, SQLQuery, parameters): Promise<any>{
    return await new Promise(
        (resolve, reject) => {
            database[func](SQLQuery, parameters, (err, row) => { err ? reject(err) : resolve(row) })
        }
    )
}

/** createTable *************************************************************************************************************************************
 * Creates the database table if it doesnt exist                                                                                                    *
 ***************************************************************************************************************************************************/
async function createTable(){
    var createQuery = `
        CREATE TABLE IF NOT EXISTS Profile (
            id INTEGER PRIMARY KEY,
            name TEXT DEFAULT "New Profile", 
            searchCriteria TEXT DEFAULT "",
            noteID TEXT DEFAULT "",
            showCompleted BOOLEAN DEFAULT 0,
            showNoDue BOOLEAN DEFAULT 0,
            displayFormat TEXT DEFAULT "interval",
            yearFormat TEXT DEFAULT "numeric",
            monthFormat TEXT DEFAULT "long",
            dayFormat TEXT DEFAULT "numeric",
            weekdayFormat TEXT DEFAULT "long",
            timeIs12Hour BOOLEAN DEFAULT 1
        )
    `
    await runQuery('run', createQuery, {})
}

/** createProfile ***********************************************************************************************************************************
 * Creates a new profile in the database with default settings. The ID of the created profile is returned                                           *
 ***************************************************************************************************************************************************/
export async function createProfile(){
    await runQuery('run', `INSERT INTO Profile DEFAULT VALUES`, {})
    return (await runQuery("get", " SELECT LAST_INSERT_ROWID()", {}))['LAST_INSERT_ROWID()']
}

/** getAllProfiles **********************************************************************************************************************************
 * Gets all profiless from the database                                                                                                             *
 ***************************************************************************************************************************************************/
export async function getAllProfiles(){
    return await runQuery('all', `SELECT * FROM Profile`, {})
}

/** getProfile ***************************************************************************************************************************************
 * Gets profile from the database for the corresponding profile ID                                                                                  *
 ***************************************************************************************************************************************************/
export async function getProfile(profileID){
    return await runQuery('get', `SELECT * FROM Profile WHERE id = $id`, {$id: profileID})
}

/** UpdateProfile ***********************************************************************************************************************************
 * Updates a profile in the database when given the profile ID and profile dict                                                                     *
 ***************************************************************************************************************************************************/
export async function updateProfile(id, profile){
    var updateQuery = `
        UPDATE Profile
        SET
            name = $name,
            searchCriteria = $searchCriteria,
            noteID = $noteID,
            showCompleted = $showCompleted,
            showNoDue = $showNoDue,
            displayFormat = $displayFormat,
            yearFormat = $yearFormat,
            monthFormat = $monthFormat,
            dayFormat = $dayFormat,
            weekdayFormat = $weekdayFormat,
            timeIs12Hour = $timeIs12Hour
        WHERE id = $id
    `
    var updateParameters = {
        $id: id,
        $name: profile.name,
        $searchCriteria: profile.searchCriteria,
        $noteID: profile.noteID,
        $showCompleted: profile.showCompleted,
        $showNoDue: profile.showNoDue,
        $displayFormat: profile.displayFormat,
        $yearFormat: profile.yearFormat,
        $monthFormat: profile.monthFormat,
        $dayFormat: profile.dayFormat,
        $weekdayFormat: profile.weekdayFormat,
        $timeIs12Hour: profile.timeIs12Hour
    }
    await runQuery('run', updateQuery, updateParameters)
}

/** deleteRecord ************************************************************************************************************************************
 * Deletes a profile record from the database for the corresponding ID, so long as its not the last profile                                         *
 ***************************************************************************************************************************************************/
export async function deleteProfile(id){
    if ((await getAllProfiles()).length > 1){
        await runQuery('run', `DELETE FROM Profile WHERE id = $id`, {$id: id})
    } else {
        throw new Error("At least one profile must be in the database");
    }
}

/** setupDatabase ***********************************************************************************************************************************
 * Creates the folder the database will be stored in then creates the database. This should run at plugin startup.                                  *
 ***************************************************************************************************************************************************/
 export async function setupDatabase(){
    var pluginDir = await joplin.plugins.dataDir()
    var databasePath = pluginDir + "/profiles.sqlite3"
    await fs.ensureDir(pluginDir)
    database = new sqlite3.Database(databasePath)
    await createTable()
    if ((await getAllProfiles()).length < 1){
        await createProfile()
    }
}
