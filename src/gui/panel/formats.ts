import { groupBy } from "../../logic/misc"


export var formatterList = {
    'date': getDateFormat,
    'interval': getIntervalFormat
}


export async function getDateFormat(todoList){
    var formattedHTML = ""
    function dateGrouping(todo){
        return todo.todo_due != 0 ? getDate(todo.todo_due) : "No Due Date"
    }
    function getDate(date){
        return new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }
    function getTime(date){
        return new Date(todo.todo_due).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}).concat(" - ")
    }
    var todoArray = groupBy(todoList, dateGrouping)
    for (var dateGroup of todoArray){
        formattedHTML = formattedHTML.concat(`<h2 class="agendaDate">${dateGroup[0]}</h2>`)    
        for (var todo of dateGroup[1]){
            var dueTime = todo.todo_due != 0 ? getTime(todo.todo_due) : ""
            var checkedString = todo.todo_completed != 0 ? "checked" : ""
            var todoHTMLString = `
                <p class="agendaTodo">
                    <input type="checkbox" onchange="onTodoChecked('${todo.id}')" ${checkedString}>
                    <a onclick="onTodoClicked('${todo.id}')">${dueTime} ${todo.title}</a>
                </p>
            `
            formattedHTML = formattedHTML.concat(todoHTMLString)    
        }
    }
    return formattedHTML
}

export async function getIntervalFormat(todoList){
    var formattedHTML = ""

    var startOfToday = new Date()
    startOfToday.setUTCHours(0,0,0,0);

    var endOfToday = new Date();
    endOfToday.setUTCHours(23,59,59,999);

    var endOfWeek = new Date()
    endOfWeek.setDate(endOfWeek.getDate() - (endOfWeek.getDay() - 1) + 6);
    endOfWeek.setUTCHours(23,59,59,999);


    var endOfMonth = new Date()
    endOfMonth = new Date(endOfMonth.getFullYear(), endOfMonth.getMonth() + 1, 0);

    var endOfYear = new Date(new Date().getFullYear(), 11, 31)

    function intervalGrouping(todo){
        var todoDate =  new Date(todo.todo_due)
        if (todo.todo_due == 0){
            return "No Due Date"
        }
        if (todoDate < startOfToday){
            return "Overdue"
        } 
        if (todoDate < endOfToday){
            return "Today"
        }
        if (todoDate < endOfWeek){
            return "This Week"
        }
        if (todoDate < endOfMonth){
            return "This Month"
        }
        if (todoDate < endOfYear){
            return "This Year"
        }
        return "Future"
    }

    function getDate(date){
        return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' })
    }

    function getTime(date){
        return new Date(todo.todo_due).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}).concat(" - ")
    }

    var todoArray = groupBy(todoList, intervalGrouping)
    for (var dateGroup of todoArray){
        formattedHTML = formattedHTML.concat(`<h2 class="agendaDate">${dateGroup[0]}</h2>`)    
        for (var todo of dateGroup[1]){
            var dueDate = todo.todo_due != 0 ? `${getDate(todo.todo_due)} - ${getTime(todo.todo_due)}` : ""
            var checkedString = todo.todo_completed != 0 ? "checked" : ""
            var todoHTMLString = `
                <p class="agendaTodo">
                    <input type="checkbox" onchange="onTodoChecked('${todo.id}')" ${checkedString}>
                    <a onclick="onTodoClicked('${todo.id}')">${dueDate}${todo.title}</a>
                </p>
            `
            formattedHTML = formattedHTML.concat(todoHTMLString)    
        }
    }
    return formattedHTML
    
}