/* Imports *****************************************************************************************************************************************/
import joplin from 'api';

/** getTodos ****************************************************************************************************************************************
 * Returns the list of todos, sorted by due date. If show completed is true, it will include completed todos. If show no due is true, it will       *
 * include todos without due dates.                                                                                                                 *
 ***************************************************************************************************************************************************/
 export async function getTodos(showCompleted, showNoDue, searchCritera){
    const completed = showCompleted ? "" : "iscompleted:0"
    const noDue = showNoDue ? "" : "due:19700201"
    var allTodos = [];
    let pageNum = 0;
    do {
        var response = await joplin.data.get(['search'], {
            query: `type:todo ${completed} ${noDue} ${searchCritera}`,
            fields: ['id', 'title', 'todo_completed', 'todo_due'], 
            type: 'note',
            order_by: 'todo_due',
            page: pageNum++,
        })
        allTodos = allTodos.concat(response.items)
    } while (response.has_more)
    return allTodos
}

/** openTodo ****************************************************************************************************************************************
 * Opens the todo with the given todo ID                                                                                                            *
 ***************************************************************************************************************************************************/
export async function openTodo(todoID){
    await joplin.commands.execute('openNote', todoID);
}

export async function getNoteContent(noteID){
    return await joplin.data.get(['notes', noteID], { fields: ['id', 'title', 'body']})
}

export async function setNoteContent(noteID, noteBody){
    await joplin.data.put(['notes', noteID], null, { body: noteBody})
}

/** toggleTodoCompletion ****************************************************************************************************************************
 * Toggles between done and undone, the todo with the given ID                                                                                      *
 ***************************************************************************************************************************************************/
export async function toggleTodoCompletion(todoID){
    var note = await joplin.data.get(['notes', todoID], {fields: ['todo_completed']});
    await joplin.data.put(['notes', todoID], null, { todo_completed: !note.todo_completed});
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