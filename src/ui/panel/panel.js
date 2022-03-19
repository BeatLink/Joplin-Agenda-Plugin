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

/** onProfilesDropdownChanged ************************************************************************************************************************
 * When the profiles dropdown is changed, this function sends a message to the main plugin to load the new profile                                   *
 ***************************************************************************************************************************************************/ 
async function onProfilesDropdownChanged(profileID){
    await webviewApi.postMessage(['profilesDropdownChanged', profileID]);
}

/** onCreateProfileClicked **************************************************************************************************************************
 * When the edit profile button for a profile is clicked, this function sends a message to the main plugin containing the profile id                *
 ***************************************************************************************************************************************************/ 
 async function onCreateProfileClicked(){
    await webviewApi.postMessage(['createProfileClicked']);
}

/** onEditProfileClicked ****************************************************************************************************************************
 * When the edit profile button for a profile is clicked, this function sends a message to the main plugin containing the profile id                *
 ***************************************************************************************************************************************************/ 
 async function onEditProfileClicked(profileID){
    await webviewApi.postMessage(['editProfileClicked']);
}

/** onDeleteProfileClicked **************************************************************************************************************************
 * When the delete profile button for a profile is clicked, this function sends a message to the main plugin containing the profile id              *
 ***************************************************************************************************************************************************/
 async function onDeleteProfileClicked(profileID){
    await webviewApi.postMessage(['deleteProfileClicked']);
}


/** onUpdateInterfacesClicked **************************************************************************************************************************
 * When the user requests an interface update, this function sends a message to the main plugin              *
 ***************************************************************************************************************************************************/
 async function onUpdateInterfacesClicked(){
    await webviewApi.postMessage(['updateInterfacesClicked']);
}
