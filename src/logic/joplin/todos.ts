/* Imports *****************************************************************************************************************************************/
import joplin from 'api';
import { updateInterfaces } from '../updater';

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
        var response = await joplin.data.get(
            ['search'],
            {
                query: `type:todo ${completed} ${noDue} ${searchCritera}`,
                fields: ['id', 'title', 'todo_completed', 'todo_due'], 
                type: 'note',
                order_by: 'todo_due',
                page: pageNum++,
            })
        allTodos += response.items
    } while (response.has_more)
    return allTodos
}

export async function openTodo(note){
    await joplin.commands.execute('openNote', note);
}


export async function toggleTodoCompletion(todoID){
    var note = await joplin.data.get(['notes', todoID], {fields: ['todo_completed']});
    await joplin.data.put(['notes', todoID], null, { todo_completed: !note.todo_completed});
    await updateInterfaces()
}