/** README **************************************************************************************************************************************
 *                                                                                                                                                  *
 *  This file is responsible for refreshing the panel interface and markdown notes whenever the content changes. Means of detecting changes include *
 *  - /events endpoint                                                                                                                              *
 *  - onNoteChange                                                                                                                                  *
 ***************************************************************************************************************************************************/

/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { refreshPanelData } from "../ui/panel/panel";
import { getProfile } from "./database";
import { connectNoteChangedCallback } from "./joplin";
import { refreshNoteData } from "./markdown";
import { getCurrentProfileID } from "./settings";

/** Variable Initialization ************************************************************************************************************************/
var refreshNeeded = false;

/** refreshInterfaces ********************************************************************************************************************************
 * Refreshes the panel and the notes associated with the current profile                                                                              *
 ***************************************************************************************************************************************************/
 export async function refreshInterfaces(){
    await refreshPanelData()
    await refreshNoteData()
}

/** setupEventHandler *******************************************************************************************************************************
 * This function sets the requestRefresh function as an event handler for note change events so that when notes are changed, an interface refresh   *
 * is requested                                                                                                                                     *
 ***************************************************************************************************************************************************/
 export async function setupEventHandler(event?){
    async function requestRefresh(event?){
        var currentProfileID = await getCurrentProfileID()
        var currentProfile = await getProfile(currentProfileID)
        if (event.item_id != currentProfile.noteID){
            refreshNeeded = true
        }
    }    
    await connectNoteChangedCallback(requestRefresh)
    await joplin.workspace.onNoteChange(requestRefresh)
}

/** setupRefreshPolling *****************************************************************************************************************************
 * This function checks every minute to see if an interface refresh has been requested and if so, triggers a refresh                                * 
 ***************************************************************************************************************************************************/
 export async function setupRefreshPolling(){
    async function pollForRefreshRequests(){
        if (refreshNeeded){
            await refreshInterfaces()
            refreshNeeded = false;
        }    
    }
    setInterval(pollForRefreshRequests, 100)
}

/** setupRefresher **********************************************************************************************************************************
 * Sets up all of the functions to detect when the panel needs to be refreshed                                                                      *
 ***************************************************************************************************************************************************/
export async function setupRefresher(){
    await setupEventHandler()
    await setupRefreshPolling()
}