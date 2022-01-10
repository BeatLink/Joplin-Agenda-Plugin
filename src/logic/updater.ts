
/** Variable Initialization ************************************************************************************************************************/
export var updateNeeded = false;





/** setupUpdatePolling ******************************************************************************************************************************
 * This function checks every minute to see if an interface update has been requested and if so, triggers an update.                                * 
 ***************************************************************************************************************************************************/
 export async function setupUpdatePolling(){
    async function pollForUpdates(){
        if (updateNeeded){
            await updateInterfaces()
            updateNeeded = false;
        }    
    }
    setInterval(pollForUpdates, 1000)
}

/** updateInterfaces ********************************************************************************************************************************
 * Updates the panel and the notes associated with the current profile                                                                              *
 ***************************************************************************************************************************************************/
export async function updateInterfaces(){
    var currentProfile = await joplin.settings.value("agendaCurrentProfile")
    var todoList = await getTodos(showCompleted, showNoDue, searchCriteria)
    var formatter = formatterList[format]
    var formattedTodosHTML = await formatter(todoList)
}

/** setupEventHandler *******************************************************************************************************************************
 * This function sets the requestUpdate function as an event handler for note update events so that when notes are changed, an interface update is  *
 * requested                                                                                                                                        *
 ***************************************************************************************************************************************************/
 export async function setupEventHandler(event?){
    async function requestUpdate(event?){
        updateNeeded = true
    }    
    await connectNoteChangedCallback(requestUpdate)
    await joplin.workspace.onNoteChange(requestUpdate)
}

/** connectNoteChangedCallback **********************************************************************************************************************
 * Creates a polling function that runs a callback whenever a note changes                                                                          *
 ***************************************************************************************************************************************************/
export async function connectNoteChangedCallback(callback){
    var cursor = null
    async function processChanges(){
        do {
            var response = await joplin.data.get(['events'], { fields: ['id', 'item_type', 'item_id', 'type', 'created_time'], cursor: cursor})
            for (var item of response.items) { 
                callback(item) 
            }
            cursor = response.cursor
        } while (response.has_more)    
    }
    setInterval(processChanges, 500)
}