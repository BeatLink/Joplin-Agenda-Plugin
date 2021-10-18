import joplin from "api";

export async function getAllToDos(){
    var allTodos = [];
    let pageNum = 0;
    let morePagesExist = false;
	do {
		let response = await joplin.data.get(['notes'], { fields: ['id', 'title', 'body', 'todo_completed'], page: pageNum++})
        allNotes = allNotes.concat(response.items)
        morePagesExist = response.has_more;
	} while (morePagesExist)
    console.log(allTodos)
    return allTodos;
}

export async function getCompletedTasks(){
    var completedTodos = [];
    let pageNum = 0;
    let morePagesExist = false;
	do {
		let response = await joplin.data.get(['search'],  {'query': 'iscompleted:1', fields: ['id', 'title', 'body', "todo_due", 'todo_completed'], page: pageNum++})
        completedTodos = completedTodos.concat(response.items)
        morePagesExist = response.has_more;
	} while (morePagesExist)
    return completedTodos;
}

export async function getNote(noteID){
    var note = null
    try {
        note = await joplin.data.get(['notes', noteID], { fields: ['id', 'title', 'body', 'todo_due', 'todo_completed']})
    } catch(error) {
        if (error.message != "Not Found") { throw(error) }
    }
    return note
}

export async function getSelectedNote(){
    return await joplin.workspace.selectedNote()
}

export async function markTaskUncompleted(id){
    await joplin.data.put(['notes', id], null, { todo_completed: 0});
}

export async function setTaskDueDate(id: string, date){
    await joplin.data.put(['notes', id], null, { todo_due: date.getTime()});
}