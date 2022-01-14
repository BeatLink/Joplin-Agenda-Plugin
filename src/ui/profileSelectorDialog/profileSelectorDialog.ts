/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { getCurrentProfile } from "../../logic/models/profile";
import { updateInterfaces } from "../../logic/updater";
const fs = joplin.require('fs-extra');

/** Variable Declaration ***************************************************************************************************************************/
var baseHtml = "";
var profileSelectorDialog = null;


/** createProfileSelectorDialog *********************************************************************************************************************
 * Creates the profile selector dialog in joplin                                                                                     *
 ***************************************************************************************************************************************************/
export async function createProfileSelectorDialog(){
    var htmlFilePath = (await joplin.plugins.installationDir()) + "/ui/profileSelectorDialog/profileSelectorDialog.html"
    baseHtml = await fs.readFile(htmlFilePath, 'utf8');
    profileSelectorDialog = await joplin.views.dialogs.create('profileSelectorDialog')
    //await joplin.views.dialogs.addScript(profileSelectorDialog, 'ui/profileSelectorDialog/profileSelectorDialog.js')
    //await joplin.views.dialogs.addScript(profileSelectorDialog, 'ui/profileSelectorDialog/profileSelectorDialog.css')
    //await joplin.views.panels.onMessage(profileSelectorDialog, profileSelectorDialogEventHandler)
}

/** profileSelectorDialogEventHandler ***************************************************************************************************************************
 * Processes all events triggered by the panel's internal javascript                                                                                *
 ***************************************************************************************************************************************************
async function profileSelectorDialogEventHandler(message){
    if (message[0] == 'todoClicked'){
        await openTodo(message[1])
    } else if (message[0] == 'todoChecked'){
        await toggleTodoCompletion(message[1])
        await updateInterfaces()
    } else if (message[0] == 'currentProfileSelected'){
        //todo open profile selector here
    }
}        */