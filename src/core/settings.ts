import joplin from "api"
import { SettingItemType } from "api/types"
import { updatePanelData } from "../gui/panel"
import { loadDateSettings } from "./dates"

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
            value: "interval",
            public: true,
            section: "agendaSettingsSection"
        },
        "agendaSearchCritera": {
            label: "Enter the search criteria for todos shown by Agenda",
            type: SettingItemType.String,
            value: "",
            public: true,
            section: "agendaSettingsSection"
        },
        "agendaDateYearFormat": {
            label: "Date Format (Year)",
            type: SettingItemType.String,
            isEnum: true,
            options: {
                "numeric": '2022', 
                "2-digit": "22"
            },
            value: "numeric",
            public: true,
            section: "agendaSettingsSection"
        },

        "agendaDateMonthFormat": {
            label: "Date Format (Month)",
            type: SettingItemType.String,
            isEnum: true,
            options: {
                "numeric": '1', 
                "2-digit": "01",
                "long": "January",
                "short": "Jan",
                "narrow": ""
            },
            value: "numeric",
            public: true,
            section: "agendaSettingsSection"
        },
        "agendaDateDayFormat": {
            label: "Date Format (Day)",
            type: SettingItemType.String,
            isEnum: true,
            options: {
                "numeric": '1', 
                "2-digit": "01",
            },
            value: "numeric",
            public: true,
            section: "agendaSettingsSection"
        },
        "agendaDateWeekdayFormat": {
            label: "Weekday Format",
            type: SettingItemType.String,
            isEnum: true,
            options: {
                'long': 'Monday', 
                'short': "Mon",
                'narrow': "M",
            },
            value: 'long',
            public: true,
            section: "agendaSettingsSection"
        },
        "agendaTimeFormat": {
            label: "Time Format",
            type: SettingItemType.Bool,
            isEnum: true,
            options: {
                true: 'AM/PM', 
                false: "24 Hours",
            },
            value: false,
            public: true,
            section: "agendaSettingsSection"
        },

    })
    joplin.settings.onChange(updatePanelData)
    joplin.settings.onChange(loadDateSettings)

}
