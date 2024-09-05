
// Get Form Elements
let nameInput = document.getElementById("nameInput")
let sortOrderInput = document.getElementById("sortOrderInput")
let searchCriteriaInput = document.getElementById("searchCriteriaInput")
let noteIDInput = document.getElementById("noteIDInput")
let showCompletedCheckbox = document.getElementById("showCompletedCheckbox")
let showNoDueCheckbox = document.getElementById("showNoDueCheckbox")
let displayFormatSelect = document.getElementById("displayFormatSelect")
let yearFormatSelect = document.getElementById("yearFormatSelect")
let monthFormatSelect = document.getElementById("monthFormatSelect")
let dayFormatSelect = document.getElementById("dayFormatSelect")
let weekdayFormatSelect = document.getElementById("weekdayFormatSelect")
let timeIs12HourCheckbox = document.getElementById("timeIs12HourCheckbox")
let profileDataInput = document.getElementById("profileDataInput")
let noDueDatesAtEndCheckbox = document.getElementById("noDueDatesAtEndCheckbox")

// Connect Event Handlers
nameInput.addEventListener("change", saveProfileData)
sortOrderInput.addEventListener("change", saveProfileData)
searchCriteriaInput.addEventListener("change", saveProfileData)
noteIDInput.addEventListener("change", saveProfileData)
showCompletedCheckbox.addEventListener("change", saveProfileData)
showNoDueCheckbox.addEventListener("change", saveProfileData)
displayFormatSelect.addEventListener("change", saveProfileData)
yearFormatSelect.addEventListener("change", saveProfileData)
monthFormatSelect.addEventListener("change", saveProfileData)
dayFormatSelect.addEventListener("change", saveProfileData)
weekdayFormatSelect.addEventListener("change", saveProfileData)
timeIs12HourCheckbox.addEventListener("change", saveProfileData)
noDueDatesAtEndCheckbox.addEventListener("change", saveProfileData)

// Load Profile Data
function loadProfileData() {
    if (profileDataInput.value != "<<PROFILE_DATA>>"){
        var profileObject = JSON.parse(decodeURI(atob(profileDataInput.value)))
        nameInput.value = profileObject["name"]
        sortOrderInput.value = profileObject["sortOrder"]
        searchCriteriaInput.value = profileObject["searchCriteria"]
        noteIDInput.value = profileObject["noteID"]
        showCompletedCheckbox.checked = profileObject["showCompleted"]
        showNoDueCheckbox.checked = profileObject["showNoDue"]
        displayFormatSelect.value = profileObject["displayFormat"]
        yearFormatSelect.value = profileObject["yearFormat"]
        monthFormatSelect.value = profileObject["monthFormat"]
        dayFormatSelect.value = profileObject["dayFormat"]
        weekdayFormatSelect.value = profileObject["weekdayFormat"]
        timeIs12HourCheckbox.checked = profileObject["timeIs12Hour"]
        noDueDatesAtEndCheckbox.checked = profileObject["noDueDatesAtEnd"]    
    }
}

// Save Profile Data
function saveProfileData(){
    var profileObject = {
        "name": nameInput.value,
        "sortOrder": sortOrderInput.value,
        "searchCriteria": searchCriteriaInput.value,
        "noteID": noteIDInput.value,
        "showCompleted": showCompletedCheckbox.checked,
        "showNoDue": showNoDueCheckbox.checked,
        "displayFormat": displayFormatSelect.value,
        "yearFormat": yearFormatSelect.value,
        "monthFormat": monthFormatSelect.value,
        "dayFormat": dayFormatSelect.value,
        "weekdayFormat": weekdayFormatSelect.value,
        "timeIs12Hour": timeIs12HourCheckbox.checked,
        "noDueDatesAtEnd": noDueDatesAtEndCheckbox.checked
    }
    profileDataInput.value = btoa(encodeURI(JSON.stringify(profileObject)))
}

loadProfileData()
saveProfileData()