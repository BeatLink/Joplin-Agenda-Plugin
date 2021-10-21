import joplin from "api";
//import { getRecord, updateRecord } from "./database";
//import { getCompletedTasks, markTaskUncompleted, setTaskDueDate } from "./joplin";



/*

Database get task with nearest todo date if task is enabled
    if due date has passed
        undo task
        increment todo date to next date
    else:
        set timer to run this function at todo date and exit
*/



/* reviewCompletedTasks ********************************************************************************************************************
    Processes completed tasks every 30 for any changes. 


export async function reviewCompletedTasks(){
    while (true) {                                                          // Infinite loop
        await new Promise(r => setTimeout(r, 1 * 1000));                    // Sleep for 1 second
        for (var todo) //(var task of await getCompletedTasks()){                        // For note in completed notes
            //var recurrence = await getRecord(task.id)                       // Get recurrence data for task
            if (true){//(recurrence.enabled){                                        // If recurrence is enabled for the task
                var initialDate = new Date(task.todo_due != 0 ? task.todo_due : task.todo_completed)                   // Create initial date from due or  completion datetime
                //var nextDate = recurrence.getNextDate(initialDate)          // Calculate next date from initial date
                //if (nextDate.getTime() <= Date.now())                       // If next date is in the past or now
                //resetTask(task.id, nextDate)                                          // Reset task
            }
        }            
    }
}

/* resetTask ******************************************************************************************************************************
    Resets the task by marking it as uncompleted and updating the recurrence state

async function resetTask(id, futureDate: Date){
    await setTaskDueDate(id, futureDate)
    await markTaskUncompleted(id)                                       // Marks the task as uncomplete
    //var recurrence = await getRecord(id)                                // Gets the recurrence from the database
    //recurrence.updateStopStatus()                                       // Updates the recurrence stop status
    //updateRecord(id, recurrence)                                        // Saves the changed recurrence data to the database

}*/