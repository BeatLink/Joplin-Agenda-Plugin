


/** README ******************************************************************************************************************************************
 * This file contains all functions involved in managing the recurrence database.                                                                   *
 * This sqlite3 recurrence database is stored in the plugin directory and holds all of the specific details about how each task in joplin would     *
 * recur if at all. Each recurrence id in the  database corresponds with the note/task id in joplin which the recurrence affects.                   *
 ***************************************************************************************************************************************************/

/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { Recurrence } from "../model/recurrence";
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
        CREATE TABLE IF NOT EXISTS Recurrence (
            id TEXT PRIMARY KEY, 
            enabled BOOLEAN,
            interval TEXT,
            intervalNumber INTEGER,
            weekSunday BOOLEAN,
            weekMonday BOOLEAN,
            weekTuesday BOOLEAN,
            weekWednesday BOOLEAN,
            weekThursday BOOLEAN,
            weekFriday BOOLEAN,
            weekSaturday BOOLEAN,
            monthOrdinal TEXT, 
            monthWeekday TEXT,
            stopType TEXT,
            stopDate TEXT,
            stopNumber INTEGER
        )
    `
    runQuery('run', createQuery, {})
}

/** createRecord ************************************************************************************************************************************
 * Creates a new recurrence record in the recurrence database when given the noteID and recurrence data object.                                     *
 ***************************************************************************************************************************************************/
export async function createRecord(id: string, recurrence:Recurrence){
    await runQuery('run', `INSERT INTO Recurrence (id) VALUES ($id)`, {$id: id})
    await updateRecord(id, recurrence);
}

/** getAllRecords ***********************************************************************************************************************************
 * Gets all records from the database                                                                                                               *
 ***************************************************************************************************************************************************/
export async function getAllRecords(){
    var records = await runQuery('all', `SELECT * FROM Recurrence`, {})
    return records.map((record) => ({id: record.id, recurrence: getRecordAsRecurrence(record)}))
}

/** getRecord ***************************************************************************************************************************************
 * Gets recurrence record from the database for the corresponding note ID                                                                           *
 ***************************************************************************************************************************************************/
export async function getRecord(id): Promise<Recurrence>{
    var record = await runQuery('get', `SELECT * FROM Recurrence WHERE id = $id`, {$id: id})
    return getRecordAsRecurrence(record)
}

/** UpdateRecord ************************************************************************************************************************************
 * This is a helper function that updates a recurrence record in the database when given the noteID and recurrence data object                      *
 ***************************************************************************************************************************************************/
export async function updateRecord(id: string, recurrence:Recurrence){
    var updateQuery = `
        UPDATE Recurrence
        SET
            enabled = $enabled,
            interval = $interval,
            intervalNumber = $intervalNumber,
            weekSunday = $weekSunday,
            weekMonday = $weekMonday,
            weekTuesday = $weekTuesday,
            weekWednesday = $weekWednesday,
            weekThursday = $weekThursday,
            weekFriday = $weekFriday,
            weekSaturday = $weekSaturday,
            monthOrdinal = $monthOrdinal,
            monthWeekday = $monthWeekday,
            stopType = $stopType,
            stopDate = $stopDate,
            stopNumber = $stopNumber
        WHERE id = $id
    `
    var updateParameters = {
        $id: id,
        $enabled: recurrence.enabled,
        $interval: recurrence.interval,
        $intervalNumber: recurrence.intervalNumber,
        $weekSunday: recurrence.weekSunday,
        $weekMonday: recurrence.weekMonday,
        $weekTuesday: recurrence.weekTuesday,
        $weekWednesday: recurrence.weekWednesday,
        $weekThursday: recurrence.weekThursday,
        $weekFriday: recurrence.weekFriday,
        $weekSaturday: recurrence.weekSaturday,
        $monthOrdinal: recurrence.monthOrdinal,
        $monthWeekday: recurrence.monthWeekday,
        $stopType: recurrence.stopType,
        $stopDate: recurrence.stopDate,
        $stopNumber: recurrence.stopNumber,
    }
    await runQuery('run', updateQuery, updateParameters)
}

/** deleteRecord ************************************************************************************************************************************
 * This is a helper function that deletes a recurrence record from the database for the corresponding note ID.                                      *
 ***************************************************************************************************************************************************/
export async function deleteRecord(id){
    await runQuery('run', `DELETE FROM Recurrence WHERE id = $id`, {$id: id})
}

/** convertTecordToRecurrence ***********************************************************************************************************************
 * Converts a database record from an sqlite3 output to a recurrence object                                                                         *
 ***************************************************************************************************************************************************/
function getRecordAsRecurrence(record): Recurrence{
    if (record != undefined){
        var recurrence = new Recurrence()
        recurrence.enabled = record.enabled
        recurrence.interval = record.interval
        recurrence.intervalNumber = record.intervalNumber
        recurrence.weekSunday = record.weekSunday
        recurrence.weekMonday = record.weekMonday
        recurrence.weekTuesday = record.weekTuesday
        recurrence.weekWednesday = record.weekWednesday
        recurrence.weekThursday = record.weekThursday
        recurrence.weekFriday = record.weekFriday
        recurrence.weekSaturday = record.weekSaturday
        recurrence.monthOrdinal = record.monthOrdinal
        recurrence.monthWeekday = record.monthWeekday
        recurrence.stopType = record.stopType
        recurrence.stopDate = record.stopDate
        recurrence.stopNumber = record.stopNumber
        return recurrence
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
