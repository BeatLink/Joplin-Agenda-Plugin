import joplin from "api";
import { groupBy } from "./misc"


/* getTodos *****************************************************************************************************************************************
    Returns the list of uncompleted todos sorted by due date
*/
export async function getTodos(){
    var allTodos = [];
    let pageNum = 0;
    let morePagesExist = true;
	while (morePagesExist) {
		let response = await joplin.data.get(['notes'], { fields: ['id', 'title', 'is_todo', 'todo_completed', 'todo_due'], page: pageNum++})
        allTodos = allTodos.concat(response.items)
        morePagesExist = response.has_more;
	}
    var filteredTodos = []
    for (var todo of allTodos){
        if (todo.is_todo == 1  && todo.todo_completed == 0){
            filteredTodos.push(todo)
        }
    }
    var sortedTodos = filteredTodos.sort((n1,n2) => n1.todo_due - n2.todo_due)
    var todoArray = groupBy(sortedTodos, (todo) => todo.todo_due != 0 ? (new Date(todo.todo_due)).toDateString() : "No Due Date")
    return todoArray
}

/* openTodo *****************************************************************************************************************************************
    Opens the note with the given ID
*/
export async function openTodo(todoID: string){
    await joplin.commands.execute('openNote', todoID);
}

/* toggleTodoCompletion *****************************************************************************************************************************
    Toggles the todo completion state
*/
export async function toggleToDoCompletion(noteID: string){
    await joplin.data.put(['notes', noteID], null, { todo_completed: 0});
}