
/******************************************************************************************************************************************
************************************************************* Stop Data *******************************************************************
******************************************************************************************************************************************/


async function onTodoClicked(todoID){
    await webviewApi.postMessage(['todoClicked', todoID]);
}

async function onTodoChecked(todoID){
    await webviewApi.postMessage(['todoChecked', todoID]);
}



`
let weekFieldset = document.getElementById('weekFieldset');
let weekSundayCheckbox = document.getElementById('weekSundayCheckbox')
let weekMondayCheckbox = document.getElementById('weekMondayCheckbox')
let weekTuesdayCheckbox = document.getElementById('weekTuesdayCheckbox')
let weekWednesdayCheckbox = document.getElementById('weekWednesdayCheckbox')
let weekThursdayCheckbox = document.getElementById('weekThursdayCheckbox')
let weekFridayCheckbox = document.getElementById('weekFridayCheckbox')
let weekSaturdayCheckbox = document.getElementById('weekSaturdayCheckbox')
weekSundayCheckbox.addEventListener("change", onWeekSundayCheckboxChanged);
weekMondayCheckbox.addEventListener("change", onWeekMondayCheckboxChanged);
weekTuesdayCheckbox.addEventListener("change", onWeekTuesdayCheckboxChanged);
weekWednesdayCheckbox.addEventListener("change", onWeekWednesdayCheckboxChanged);
weekThursdayCheckbox.addEventListener("change", onWeekThursdayCheckboxChanged);
weekFridayCheckbox.addEventListener("change", onWeekFridayCheckboxChanged);
weekSaturdayCheckbox.addEventListener("change", onWeekSaturdayCheckboxChanged);

function onWeekSundayCheckboxChanged(){
    recurrence.weekSunday = weekSundayCheckbox.checked
    saveData()
}
function onWeekMondayCheckboxChanged(){
    recurrence.weekMonday = weekMondayCheckbox.checked
    saveData()
}
function onWeekTuesdayCheckboxChanged(){
    recurrence.weekTuesday = weekTuesdayCheckbox.checked
    saveData()
}
function onWeekWednesdayCheckboxChanged(){
    recurrence.weekWednesday = weekWednesdayCheckbox.checked
    saveData()
}
function onWeekThursdayCheckboxChanged(){
    recurrence.weekThursday = weekThursdayCheckbox.checked
    saveData()
}
function onWeekFridayCheckboxChanged(){
    recurrence.weekFriday = weekFridayCheckbox.checked
    saveData()
}
function onWeekSaturdayCheckboxChanged(){
    recurrence.weekSaturday = weekSaturdayCheckbox.checked
    saveData()
}


`