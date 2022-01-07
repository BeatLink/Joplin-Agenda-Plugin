import { groupBy } from "src/misc/groupby"

export abstract class Format {
 
    protected abstract getHeadingString(todo): string
 
    protected abstract getTodoString(todo, heading): string

    public markdownFormatter(todoList) {
        function markdownHeading(todo){
            var headingString = this.getHeadingString(todo)
            return `## ${headingString}`
        }
        function markdownTodo(todo, heading){
            var checkedString = todo.todo_completed ? "x" : "" 
            var todoString = this.getTodoString(todo, heading)
            return `- [${checkedString}] [${todoString}](:/${todo.id})`
        }
        return this.genericFormatter(todoList, markdownHeading, markdownTodo)
    }

    public htmlFormatter(todoList){
        function htmlHeading(todo){
            var headingString = this.getHeadingString(todo)
            return `<h2>${headingString}</h2>`
        }
        function htmlTodo(todo, heading){
            var checkedString = todo.todo_completed ? "checked" : "" 
            var todoString = this.getTodoString(todo, heading)
            return `
                <p>
                    <input type="checkbox" onchange="onTodoChecked('${todo.id}')" ${checkedString}>
                    <a onclick="onTodoClicked('${todo.id}')">${todoString}</a>
                </p>
            `        
        }
        return this.genericFormatter(todoList, htmlHeading, htmlTodo)
    }

    private genericFormatter(todoList, headingFunction, todoFunction){
        var formattedHTML = ""
        var todoMap = groupBy(todoList, headingFunction)
        for (var dateGroup of todoMap){
            formattedHTML = formattedHTML.concat(dateGroup[0])    
            for (var todo of dateGroup[1]){
                formattedHTML = formattedHTML.concat(todoFunction(todo, dateGroup[0]))    
            }
        }
        return formattedHTML

    }
        

}
