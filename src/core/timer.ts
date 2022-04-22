/** README **************************************************************************************************************************************
 *                                                                                                                                                  *
 *  This file is responsible for refreshing the panel interface and markdown notes whenever the content changes. Means of detecting changes include *
 *  - /events endpoint                                                                                                                              *
 *  - onNoteChange                                                                                                                                  *
 ***************************************************************************************************************************************************/

/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { refreshPanelData } from "../ui/panel/panel";
import { refreshNoteData } from "./markdown";

/** Variable Initialization ************************************************************************************************************************/
var timer = null
var updating = false;

/** refreshInterfaces ********************************************************************************************************************************
 * Refreshes the panel and the notes associated with the current profile                                                                              *
 ***************************************************************************************************************************************************/
 export async function refreshInterfaces(){
    if (updating) return;
    updating = true;
    await refreshPanelData()
    await refreshNoteData()
    updating = false;
}

export async function setupTimer(){
    clearInterval(timer)
    timer = setInterval(refreshInterfaces, await joplin.settings.value("updateFrequency") * 1000);
}
