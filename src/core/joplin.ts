/** README *****************************************************************************************************************************************
 * This file handles misc calls to the joplin plugin api                                                                                           *
 **************************************************************************************************************************************************/

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
    let pageNum = 1;
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

/** getNoteContent **********************************************************************************************************************************
 * Gets the body of the note with the given noteID                                                                                                  *
 ***************************************************************************************************************************************************/
export async function getNoteContent(noteID){
    return await joplin.data.get(['notes', noteID], { fields: ['id', 'title', 'body']})
}

/** setNoteContent **********************************************************************************************************************************
 * Sets the body of the note with the given noteID to the given note body                                                                           *
 ***************************************************************************************************************************************************/
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
