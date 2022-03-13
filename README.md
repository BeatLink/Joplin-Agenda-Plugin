# Agenda

An agenda/calendar/schedule panel plugin for joplin that shows all uncompleted to-dos with a due date

## Screenshots

### Main Interface
![Screenshot1](docs/Screenshot1.png)

### The Agenda Panel
![Screenshot2](docs/Screenshot2.png)


## Installation
Agenda is already in the Joplin plugin repository so it can be installed from the plugins page inside Joplin settings.
1. Open Joplin
2. Go to Tools -> Options in the menu bar
3. Go to Plugins
4. Search for "Agenda"
5. Click Install

## Usage
Agenda uses profiles to know how to sort, organize and present to-dos in the todo list. You can create many different profiles to generate the to-do lists
you need. For example, you may have one profile for your work to-dos and another for your personal to-dos. You can have one for active tasks, and one for tasks being held. The only limit to the profile system is your imaginatio and the Joplin search system. 

### Showing and Hiding the Panel
To show or hide the panel, click the calendar (&#f133;) icon in the toolbar, or click the menu option under Tools -> Agenda

### Creating a Profile
* To create a profile, click the plus (&#f067;) button in the panel, beside the profile dropdown, fill out the profile options and then press create.

### Editing a Profile
* To edit an existing profile, click the pencil (&#f044;) button in the panel beside the profile dropdown, edit the profile options and then press save.

### Deleting a Profile
* To delete an existing profile, click the trashcan (&#f1f8;) button in the panel beside the profile dropdown, and then press delete to confirm. 

### Selecting a Profile
* To select a profile, use the profile dropdown list at the top of the panel. 

### Profile Options

#### Name
* In the name box, you can set the name of the profile, that's shown in the profile selection dropdown. 

#### Search Criteria
* In the search criteria box, you can enter the search terms that Agenda will use to find tasks for this profile. Anything that you can enter in the joplin search bar, you can enter here. See the joplin search syntax for details. 

#### Overview Note ID
* The Overview Note ID box allows you to copy all the tasks in the current profile to a new note called the Overview Note. This means that each profile in Agenda, can have a note listing all the tasks for that profile. That way, you can still have your task lists without the Agenda plugin itself, such as in the mobile app. To setup the Overview Note, create a new note where you want all your tasks to be stored, and copy its note ID to the Overview Note ID box in the agenda profile options. It's important to note that Agenda will overwrite this note on every update, so make sure you create a note specifically for this purpose and do not make changes to it or those changes will be lost. 

#### Show Completed
* The show completed checkbox, if checked, will show tasks even if they have been completed. Otherwise, these tasks will be hidden

#### Show without Due Dates
* The show to-dos without due dates, if checked, will show to-dos, even if they have no due date/alarms set. 

#### Display Format
* The display format allows you to select how the to-dos are displayed in the list. There are currently two options:
    * Interval - This will group to-dos according to the following categories:
        - Overdue
        - Today
        - This Week
        - This Month
        - This Year
    * Date - This will group to-dos by the date they are due.

#### Date and Weekday Formats
* The date and weekday format dropdowns allow you to set how dates are shown in the panel and notes

#### Time Formats
* The time format checkbox allows you to switch between AM/PM or 24 hour time. 

### Settings
* The show profile controls checkbox toggles the create, edit and delete buttons in the panel.

## Development
* Download Repo
* Run `npm install`
* Modify code in `/src`
* Update Metadata in `/src/manifest.json` and `/package.json`
* Build plugin with `npm run dist`
* Update the plugin framework with `npm run update`
* Publish using `npm publish`
