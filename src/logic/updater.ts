/** Updater.ts **************************************************************************************************************************************
 *                                                                                                                                                  *
 *  This file is responsible for refreshing the panel interface and markdown notes whenever the content changes. Means of detecting changes include *
 *  - /events endpoint
 *  - onNoteChange 
 *  - Scheduled updates
 ***************************************************************************************************************************************************/

/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { updatePanelData } from "../ui/panel/panel";
import { DateFormat } from "./models/formats/date";
import { IntervalFormat } from "./models/formats/interval";
import { connectNoteChangedCallback } from "./joplin";
import { Profile } from "./models/profile";

/** Variable Initialization ************************************************************************************************************************/
var updateNeeded = false;

export async function setupUpdater(){
    await setupEventHandler()
    await setupUpdatePolling()
}

/** setupEventHandler *******************************************************************************************************************************
 * This function sets the requestUpdate function as an event handler for note update events so that when notes are changed, an interface update is  *
 * requested                                                                                                                                        *
 ***************************************************************************************************************************************************/
 export async function setupEventHandler(event?){
    async function requestUpdate(event?){
        updateNeeded = true
    }    
    await connectNoteChangedCallback(requestUpdate)
    await joplin.workspace.onNoteChange(requestUpdate)
}

/** setupUpdatePolling ******************************************************************************************************************************
 * This function checks every minute to see if an interface update has been requested and if so, triggers an update.                                * 
 ***************************************************************************************************************************************************/
 export async function setupUpdatePolling(){
    async function pollForUpdates(){
        if (updateNeeded){
            await updateInterfaces()
            updateNeeded = false;
        }    
    }
    setInterval(pollForUpdates, 1000)
}

/** updateInterfaces ********************************************************************************************************************************
 * Updates the panel and the notes associated with the current profile                                                                              *
 ***************************************************************************************************************************************************/
export async function updateInterfaces(){
    await updatePanelData()
}