/**
 * This is the abstract class that all other formats must inherit from 
 */
 abstract class BaseFormat {
    
    
    constructor(profile) {

    }

    
    /**
     * This method must be implemented by all formats. It must take the given todo and return a string representing 
     * the heading under which thsi todo should fall
     * 
     * @param todo 
     */
    protected abstract getFormattedHeadingString(todo, profile): string
    
    protected abstract getFormattedTodoString(todo, heading, profile): string
    
    public getString(todoList, mode, profile){
        var formattedHTML = ""
        var todoMap = groupBy(todoList, (todo) => {this.getHeadingString(todo, mode, profile)})
        for (var dateGroup of todoMap){
            formattedHTML = formattedHTML.concat(dateGroup[0])    
            for (var todo of dateGroup[1]){
                formattedHTML = formattedHTML.concat(this.getTodoString(todo, dateGroup[0], mode, profile))    
            }
        }
        return formattedHTML
    }
    
    private getHeadingString(todo, mode, profile){
        var headingString = this.getFormattedHeadingString(todo, profile)
        if (mode == "markdown"){
            return `## ${headingString}`    
        } else if (mode == "html") {
            return `<h2>${headingString}</h2>`    
        }
    }
    
    private getTodoString(todo, heading, mode, profile){
        var todoString = this.getFormattedTodoString(todo, heading, profile)
        if (mode == "markdown"){
            var checkedString = todo.todo_completed ? "x" : "" 
            return `- [${checkedString}] [${todoString}](:/${todo.id})`    
        } else if (mode == "html") {
            var checkedString = todo.todo_completed ? "checked" : "" 
            return `
                <p>
                    <input type="checkbox" onchange="onTodoChecked('${todo.id}')" ${checkedString}>
                    <a onclick="onTodoClicked('${todo.id}')">${todoString}</a>
                </p>
            `            
        }
    }
}
