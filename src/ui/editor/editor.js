
// Get Form Elements
let nameInput = document.getElementById("nameInput")
let searchCriteriaInput = document.getElementById("searchCriteriaInput")
let noteIDInput = document.getElementById("noteIDInput")
let showCompletedCheckbox = document.getElementById("showCompletedCheckbox")
let showNoDueCheckbox = document.getElementById("showNoDueCheckbox")
let displayFormatSelect = document.getElementById("displayFormatSelect")
let yearFormatSelect = document.getElementById("yearFormatSelect")
let monthFormatSelect = document.getElementById("monthFormatSelect")
let dayFormatSelect = document.getElementById("dayFormatSelect")
let weekdayFormatSelect = document.getElementById("weekdayFormatSelect")
let timeFormatCheckbox = document.getElementById("timeFormatCheckbox")
let profileDataInput = document.getElementById("profileDataInput")

// Connect Event Handlers
nameInput.addEventListener("change", saveProfileData)
searchCriteriaInput.addEventListener("change", saveProfileData)
noteIDInput.addEventListener("change", saveProfileData)
showCompletedCheckbox.addEventListener("change", saveProfileData)
showNoDueCheckbox.addEventListener("change", saveProfileData)
displayFormatSelect.addEventListener("change", saveProfileData)
yearFormatSelect.addEventListener("change", saveProfileData)
monthFormatSelect.addEventListener("change", saveProfileData)
dayFormatSelect.addEventListener("change", saveProfileData)
weekdayFormatSelect.addEventListener("change", saveProfileData)
timeFormatCheckbox.addEventListener("change", saveProfileData)

// Load Profile Data
function loadProfileData() {
    var profileString = atob(profileDataInput.value)
    var profileObject = JSON.parse(profileString)
    nameInput.value = profileObject["name"]
    searchCriteriaInput.value = profileObject["searchCriteria"]
    noteIDInput.value = profileObject["noteID"]
    showCompletedCheckbox.checked = profileObject["showCompleted"]
    showNoDueCheckbox.checked = profileObject["showNoDue"]
    displayFormatSelect.value = profileObject["displayFormat"]
    yearFormatSelect.value = profileObject["yearFormat"]
    monthFormatSelect.value = profileObject["monthFormat"]
    dayFormatSelect.value = profileObject["dayFormat"]
    weekdayFormatSelect.value = profileObject["weekdayFormat"]
    timeFormatCheckbox.checked = profileObject["timeFormat"]
}

// Save Profile Data
function saveProfileData(){
    var profileObject = {
        "name": nameInput.value,
        "searchCriteria": searchCriteriaInput.value,
        "noteID": noteIDInput.value,
        "showCompleted": showCompletedCheckbox.checked,
        "showNoDue": showNoDueCheckbox.checked,
        "displayFormat": displayFormatSelect.value,
        "yearFormat": yearFormatSelect.value,
        "monthFormat": monthFormatSelect.value,
        "dayFormat": dayFormatSelect.value,
        "weekdayFormat": weekdayFormatSelect.value,
        "timeFormat": timeFormatCheckbox.checked
    }
    var profileString = JSON.stringify(profileObject)
    profileDataInput.value = btoa(profileString)
}

loadProfileData()