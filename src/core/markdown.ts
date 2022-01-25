
import joplin from "api"
import { getProfilesHTML } from "src/ui/panel/panel"
import { getRecord } from "./database"
import { DateFormat } from "./formats/date"
import { IntervalFormat } from "./formats/interval"
import { getNoteContent, setNoteContent } from "./joplin"
import { Profile } from "./profile"
import { getCurrentProfileID } from "./settings"

/** updatePanelData *********************************************************************************************************************************
 * Displays all todos in the panel, grouped by date and sorted by time                                                                              *
 ***************************************************************************************************************************************************/

var baseMarkDown = `# <<PROFILE_NAME>>\n<<TODOS>>`

export async function updateNoteData(){
    var formats = {
        'interval': IntervalFormat,
        'date': DateFormat,
    }
    var currentProfileID = await getCurrentProfileID()
    var currentProfile = await getRecord(currentProfileID)
    var profile = currentProfile ? currentProfile : new Profile()
    if (profile.noteID) {
        var note = await getNoteContent(profile.noteID)
        if (note != undefined){
            var formatter = new formats[profile.displayFormat](profile)
            var todosMd = await formatter.getTodos('markdown')
            var markdownString = baseMarkDown.replace("<<PROFILE_NAME>>", profile.name)
            var markdownString = markdownString.replace("<<TODOS>>", todosMd)
            await setNoteContent(profile.noteID, markdownString)
        }    
    }
 }
