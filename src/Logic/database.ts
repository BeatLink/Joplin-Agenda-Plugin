/* database.ts ****************************************************************************************************************************

    This file contains all functions involved in managing the recurrence database. This sqlite3 recurrence database is stored in the 
    plugin directory and holds all of the specific details about how each task in joplin would recur if at all. Each recurrence id in the 
    database corresponds with the note/task id in joplin which the recurrence affects.

******************************************************************************************************************************************/

/* Imports *******************************************************************************************************************************/
import joplin from "api";
/*import { Recurrence } from "./recurrence";
import { getAllNotes, getNote } from "./joplin";
const fs = joplin.require('fs-extra')
const sqlite3 = joplin.require('sqlite3')

var database = null

/* setupDatabase **************************************************************************************************************************
    Runs the code required for database initialization and record updates. This should run at  program start. 

export async function setupDatabase(){
    const pluginDir = await joplin.plugins.dataDir();                   // Get Plugin Folder
    await fs.ensureDir(pluginDir)                                       // Create Plugin Folder if it doesnt exist
    const databasePath = pluginDir + "/database.sqlite3";               // Set database path
    database = new sqlite3.Database(databasePath);                  // Create or open database
    await createRecurrenceTable();                              // Create database table if it doesnt exist
    await updateDatabase();                                     // Synchronizes the recurrence database with the joplin state
    await connectUpdateHandler()

    return database;                                                    // Returns the database
}

/* Create Table ***************************************************************************************************************************
    Creates the database table if it doesnt exist

async function createRecurrenceTable(){
    var createQuery = `
        CREATE TABLE IF NOT EXISTS Recurrence (
            id TEXT PRIMARY KEY, 
            enabled INTEGER,
            interval TEXT,
            intervalNumber INTEGER,
            weekSunday INTEGER,
            weekMonday INTEGER,
            weekTuesday INTEGER,
            weekWednesday INTEGER, 
            weekThursday INTEGER, 
            weekFriday INTEGER,
            weekSaturday INTEGER,
            monthOrdinal TEXT, 
            monthWeekday TEXT,
            stopType TEXT,
            stopDate TEXT,
            stopNumber INTEGER,
            nextResetDate TEXT
        )
    `                                                                   // SQL Query
    runQuery('run', createQuery, {})                          // Run database create table command 
}

async function connectUpdateHandler(){
    await joplin.workspace.onNoteChange(noteUpdateHandler)
}

async function noteUpdateHandler(eventObject){
    if (eventObject.event == 1){
//        await createRecord(eventObject.id, new Recurrence())     // Add blank recurrence object to database
    } else if (eventObject.event == 3) {
        await deleteRecord(eventObject.id)
    }
}

/* updateDatabase *************************************************************************************************************************
    This function synchronizes the recurrence database with joplin notes and todos by:
        1) Creating a recurrence record in the database for each note/todo in joplin if it doesnt exist
        2) Deleting recurrence records from the database if it doesnt have a corresponding note in joplin
    This function should be run at program startup

async function updateDatabase(){
    for (var note of await getAllNotes()){                              // For note in all notes
        if (!await getRecord(note.id)){                       // If note id is not in recurrence database
    //        await createRecord(note.id, new Recurrence())     // Add blank recurrence object to database
        }
    }
    for (var record of await getAllRecords()){                  // For recurrence record in recurrence database
        if (!await getNote(record.id)){                                 // If corresponding record id not in notes
            await deleteRecord(record.id)                     // delete record
        }
    }
}

/* getallDatabaseRecords ******************************************************************************************************************
    This is a helper function that gets a recurrence record from the database for the corresponding note ID. 

async function getAllRecords(){
    var records: Array<any> = null;                                     // Initializes the database records variable
    var selectQuery = `SELECT * FROM Recurrence`                        // SQL Query to select all records
    records = await runQuery('all', selectQuery, {});         // runs the query and saves the result to the variable
    var recurrences = []                                                // Create final recurrence array
    for (var record of records){                                        // for each record in the returned records
        recurrences.push({                                              // Push to the recurrences array an object consisting of
            id: record.id,                                              // the recurrence id...
            recurrence: getRecordAsRecurrence(record)                   // and the recurrence itself
        })
    }
    return recurrences                                                  // Return the recurrence array
}

/* getDatabaseRecord **********************************************************************************************************************
    This is a helper function that gets a recurrence record from the database for the corresponding note ID. 
    Note that sqlite3 is not compatible with async/await functionality, thus the need for the query to be written as a promise. If there 
    are better ways to do this, please let me know
*/
/*export async function getRecord(id): Promise<Recurrence>{
    var record: any = null;                                             // Initialize database record variable
    var selectQuery = `SELECT * FROM Recurrence WHERE id = $id`         // Create SQL Query for the command
    var selectParam = {$id: id}                                         // Create SQL Parameters for command
    record = await runQuery('get', selectQuery, selectParam)  // Runs the query and saves the result to the variable
    return record != undefined ? getRecordAsRecurrence(record) : null   // Returns record as recurrence if it exists, otherwise null
}*/

/* createDrunQueryatabaseRecords ******************************************************************************************************************
    This is a helper function that creates a new recurrence record in the recurrence database when given the noteID and recurrence data 
    object.

async function createRecord(id: string, recurrence:Recurrence){
    var insertQuery = `INSERT INTO Recurrence (id) VALUES ($id);`       // SQL Query
    var insertParameters = {$id: id}                                    // Parameter
    await runQuery('run', insertQuery, insertParameters)      // Run the database insertion command
    await updateRecord(id, recurrence);                       // Runs the database update record command
}

/* UpdateDatabaseRecord *******************************************************************************************************************
    This is a helper function that updates a recurrence record in the database when given the noteID and recurrence data object

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
            stopNumber = $stopNumber,
            nextResetDate = $nextResetDate
        WHERE id = $id
    `                                                                   // SQL Query
    var updateParameters = {                                            // Parameters
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
        $nextResetDate: recurrence.nextResetDate
    }
    await runQuery('run', updateQuery, updateParameters)         // Runs the database update query
}

/* deleteDatabaseRecord *******************************************************************************************************************
    This is a helper function that deletes a recurrence record from the database for the corresponding note ID.

async function deleteRecord(id){
    var deleteQuery = `DELETE FROM Recurrence WHERE id = $id`           // SQL Query
    var deleteParameters = {$id: id}                                    // Parameters
    await runQuery('run', deleteQuery, deleteParameters)      // Run the database run command
}

/* runDatabaseQuery *********************************************************************************************************************
    Sqlite3 does not support async/await functionality, thus the need for this promise based function to ruin the sqlite functions. 
    If there are better ways to do this, please let me know

async function runQuery(func, SQLQuery, parameters): Promise<any>{
    return await new Promise(                                           // Processes the below promise and returns the result
        (resolve, reject) => {                                          // Create the promise function
            const callback = (err, row) => {                            // Creates database callback written as a promise processor
                err ? reject(err) : resolve(row)
            }
            if (func == 'run'){                                         // If requested function is run...
                database.run (SQLQuery,parameters, callback)            // Call the database run command
            } else if (func == 'get'){                                  // If requested function is get
                database.get(SQLQuery, parameters, callback)            // Call the database get function with the callback
            } else if (func = 'all'){                                   // If requested function is all
                database.all(SQLQuery, parameters, callback)            // Call the database all function with the callback
            }
        }
    )
}

/* convertTecordToRecurrence **************************************************************************************************************
    This is a helper function to convert a database record from an sqlite3 output to a recurrence object

function getRecordAsRecurrence(record): Recurrence{
    var recurrence = new Recurrence()
    recurrence.enabled = record.enabled == 1 ? true : false 
    recurrence.interval = record.interval
    recurrence.intervalNumber = record.intervalNumber
    recurrence.weekSunday = record.weekSunday == 1 ? true : false
    recurrence.weekMonday = record.weekMonday == 1 ? true : false
    recurrence.weekTuesday = record.weekTuesday == 1 ? true : false
    recurrence.weekWednesday = record.weekWednesday == 1 ? true : false
    recurrence.weekThursday = record.weekThursday == 1 ? true : false
    recurrence.weekFriday = record.weekFriday == 1 ? true : false
    recurrence.weekSaturday = record.weekSaturday == 1 ? true : false
    recurrence.monthOrdinal = record.monthOrdinal
    recurrence.monthWeekday = record.monthWeekday
    recurrence.stopType = record.stopType
    recurrence.stopDate = record.stopDate
    recurrence.stopNumber = record.stopNumber
    recurrence.nextResetDate = record.nextResetDate
    return recurrence
}

*/