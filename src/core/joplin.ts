import joplin from "api";

/** getTodos ****************************************************************************************************************************************
 * Returns the list of todos, sorted by due date. If show completed is true, it will include completed todos. If show no due is true, it will       *
 * include todos without due dates.                                                                                                                 *
 ***************************************************************************************************************************************************/
export async function getTodos(showCompleted, showNoDue, searchCritera){
    const completed = showCompleted ? "" : "iscompleted:0"
    const noDue = showNoDue ? "" : "due:1970"
    var allTodos = [];
    let pageNum = 0;
    do {
        console.log("fetching todos")
        var response = await joplin.data.get(
            ['search'],
            {
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
 * Opens the note with the given ID                                                                                                                 *
 ***************************************************************************************************************************************************/
export async function openTodo(todoID: string){
    await joplin.commands.execute('openNote', todoID);
}

/** toggleTodoCompletion ****************************************************************************************************************************
 * Toggles the todo completion state                                                                                                                *
 ***************************************************************************************************************************************************/
export async function toggleTodoCompletion(noteID: string){
    var note = await joplin.data.get(['notes', noteID], {fields: ['todo_completed']});
    await joplin.data.put(['notes', noteID], null, { todo_completed: !note.todo_completed});
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