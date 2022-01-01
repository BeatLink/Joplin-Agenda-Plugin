/** onTodoClicked ***********************************************************************************************************************************
 * When a todo item is clicked, this function sends a message to the main plugin containing the todo id                                             *
 ***************************************************************************************************************************************************/ 
async function onTodoClicked(todoID){
    await webviewApi.postMessage(['todoClicked', todoID]);
}

/** onTodoChecked ***********************************************************************************************************************************
 * When a todo item is checked as complete/incomplete, this function sends a message to the main plugin containing the todo id                      *
 ***************************************************************************************************************************************************/ 
async function onTodoChecked(todoID){
    await webviewApi.postMessage(['todoChecked', todoID]);
}
