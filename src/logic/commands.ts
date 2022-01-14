import joplin from "api";
import { toggleMainPanelVisibility } from "../ui/mainPanel/mainPanel";


export async function setupCommands(){
    await joplin.commands.register({
        name: 'agendaTogglePanelVisibility',
        label: 'Toggle Agenda Panel',
        iconName: 'fas fa-calendar',
        execute: toggleMainPanelVisibility
    });
}