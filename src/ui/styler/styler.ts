/** README ******************************************************************************************************************************************
 * The styler dialog allows the user to add custom css to change the appearance of the panel                                                        *
 ***************************************************************************************************************************************************/

/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { refreshPanelData } from "../panel/panel";
const fs = joplin.require('fs-extra');

/** Variable Setup *********************************************************************************************************************************/
var dialog = null;
var baseHtml = ""
var cssFilePath = ""

/** setupStyler *************************************************************************************************************************************
 * Initializes the panel styler dialog                                                                                                              *
 ***************************************************************************************************************************************************/
export async function setupStyler(){
    var HTMLFilePath = (await joplin.plugins.installationDir()) + "/ui/styler/styler.html"
    baseHtml = await fs.readFile(HTMLFilePath, 'utf8');
    dialog = await joplin.views.dialogs.create('styler');
    cssFilePath = (await joplin.plugins.installationDir()) + '/custom.css'
    if (!await fs.exists(cssFilePath)){
        await fs.writeFile(cssFilePath, "")
    }
}

/** openStyler **************************************************************************************************************************************
 * Opens the panel styler dialog where custom css for the panel can be added.                                                                       *
 ***************************************************************************************************************************************************/
export async function openStyler(){
    var cssData = await fs.readFile(cssFilePath, 'utf8');
    var formattedHtml = baseHtml.replace("<<CSS_DATA>>", cssData)
    await joplin.views.dialogs.setHtml(dialog, formattedHtml);
    var formResult = await joplin.views.dialogs.open(dialog)
    if (formResult.id == 'ok') {
        console.log(formResult)
        cssData = formResult.formData['customCSSForm']['customCss']
        await fs.writeFile(cssFilePath, cssData)
        await refreshPanelData()
    }
}