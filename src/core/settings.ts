import joplin from "api"
import { SettingItemType } from "api/types"
import { updatePanelData } from "./panel"

/** setupSettings ***********************************************************************************************************************************
 * Registers the settings for the plugin                                                                                                            *
 ***************************************************************************************************************************************************/
export async function setupSettings(){
    await joplin.settings.registerSection("agendaSettingsSection", {
        label: "Agenda",
        description: "Agenda Plugin Settings",
        iconName: 'fas fa-calendar'
    })
    await joplin.settings.registerSettings({
        "agendaPanelVisibility": {
            label: "Show Agenda Panel",
            type: SettingItemType.Bool,
            value: true,
            public: true,
            section: "agendaSettingsSection"
        },
        "agendaShowCompletedTodos": {
            label: "Show Completed To-Dos",
            type: SettingItemType.Bool,
            value: true,
            public: true,
            section: "agendaSettingsSection"
        },
        "agendaShowNoDueDateTodos": {
            label: "Show To-Dos without Due Date",
            type: SettingItemType.Bool,
            value: true,
            public: true,
            section: "agendaSettingsSection"
        },
        "agendaPanelFormat": {
            label: "Panel Format",
            type: SettingItemType.String,
            isEnum: true,
            options: {
                "date": 'Date', 
                "interval": "Interval"
            },
            value: "date",
            public: true,
            section: "agendaSettingsSection"
        },
    })
    joplin.settings.onChange(updatePanelData)
}
