/** README ******************************************************************************************************************************************
 * This file contains all functions involved in managing the agenda profile database.                                                               *
 * This sqlite3 database is stored in the plugin directory and holds all of the settings for each agenda profile.                                   *
 ***************************************************************************************************************************************************/

/** Imports ****************************************************************************************************************************************/
import joplin from "api";
const fs = joplin.require('fs-extra')
const sqlite3 = joplin.require('sqlite3')

/** Variable setup *********************************************************************************************************************************/
var databasePath = null
var database = null

/** setupDatabase ***********************************************************************************************************************************
 * Runs the code required for database initialization and record updates. This should run at  program start.                                        *
 ***************************************************************************************************************************************************/
export async function setupDatabase(){
    var pluginDir = await joplin.plugins.dataDir()
    databasePath = pluginDir + "/database.sqlite3"
    await fs.ensureDir(pluginDir)
    database = new sqlite3.Database(databasePath)
    await createTable()
}

/** createTable *************************************************************************************************************************************
 * Creates the database table if it doesnt exist                                                                                                    *
 ***************************************************************************************************************************************************/
async function createTable(){
    var createQuery = `
        CREATE TABLE IF NOT EXISTS Profile (
            id TEXT PRIMARY KEY,
            name TEXT,
            searchCriteria TEXT,
            showCompleted BOOLEAN,
            showNoDue BOOLEAN,
            displayFormat TEXT,
            yearFormat TEXT,
            monthFormat TEXT,
            dayFormat TEXT,
            weekdayFormat TEXT,
            "24hrTime" TEXT
        )
    `
    runQuery('run', createQuery, {})
}

/** createRecord ************************************************************************************************************************************
 * Creates a new recurrence record in the recurrence database when given the noteID and recurrence data object.                                     *
 ***************************************************************************************************************************************************/
export async function createRecord(profile: Profile){
    var id = await runQuery('run', `INSERT INTO Profiles DEFAULT VALUES OUTPUT inserted.id`, {})
    await updateRecord(id, profile);
}

/** getAllRecords ***********************************************************************************************************************************
 * Gets all records from the database                                                                                                               *
 ***************************************************************************************************************************************************/
export async function getAllRecords(){
    var records = await runQuery('all', `SELECT * FROM Profile`, {})
    return records.map((record) => ({id: record.id, profile: getRecordAsProfile(record)}))
}

/** getRecord ***************************************************************************************************************************************
 * Gets recurrence record from the database for the corresponding note ID                                                                           *
 ***************************************************************************************************************************************************/
export async function getRecord(id): Promise<Profile>{
    var record = await runQuery('get', `SELECT * FROM Profile WHERE id = $id`, {$id: id})
    return getRecordAsProfile(record)
}

/** UpdateRecord ************************************************************************************************************************************
 * This is a helper function that updates a recurrence record in the database when given the noteID and recurrence data object                      *
 ***************************************************************************************************************************************************/
export async function updateRecord(id: string, profile:Profile){
    var updateQuery = `
        UPDATE Profile
        SET
            name = $name
            searchCriteria = $searchCriteria
            showCompleted = $showCompleted
            showNoDue = $showNoDue
            displayFormat = $displayFormat
            yearFormat = $yearFormat
            monthFormat = $monthFormat
            dayFormat = $dayFormat
            weekdayFormat = $weekdayFormat
            timeIs24hr = $timeIs24hr
        WHERE id = $id
    `
    var updateParameters = {
        $id: id,
        $name: profile.name,
        $searchCriteria: profile.searchCriteria,
        $showCompleted: profile.showCompleted,
        $showNoDue: profile.showNoDue,
        $displayFormat: profile.displayFormat,
        $yearFormat: profile.yearFormat,
        $monthFormat: profile.monthFormat,
        $dayFormat: profile.dayFormat,
        $weekdayFormat: profile.weekdayFormat,
        $timeIs24hr: profile.timeIs24hr
    }
    await runQuery('run', updateQuery, updateParameters)
}

/** deleteRecord ************************************************************************************************************************************
 * This is a helper function that deletes a record from the database for the corresponding ID.                                                      *
 ***************************************************************************************************************************************************/
export async function deleteRecord(id){
    await runQuery('run', `DELETE FROM Profile WHERE id = $id`, {$id: id})
}

/** getRecordAsProfile ******************************************************************************************************************************
 * Converts a database record from an sqlite3 output to an agenda profile object                                                                    *
 ***************************************************************************************************************************************************/
function getRecordAsProfile(record): Profile{
    if (record != undefined){
        var profile = new Profile()
        profile.name = record.name
        profile.searchCriteria = record.searchCriteria
        profile.showCompleted = record.showCompleted
        profile.showNoDue = record.showNoDue
        profile.displayFormat = record.displayFormat
        profile.yearFormat = record.yearFormat
        profile.monthFormat = record.monthFormat
        profile.dayFormat = record.dayFormat
        profile.weekdayFormat = record.weekdayFormat
        profile.timeIs24hr = record.timeIs24hr    
        return profile
    }
}

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
