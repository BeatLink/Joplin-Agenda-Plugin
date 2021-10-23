# Agenda

An agenda/calendar/schedule panel plugin for joplin that shows all uncompleted to-dos with a due date

## Screenshots
### Main Interface
![Screenshot1](docs/Screenshot1.png)

### The Agenda Panel
![Screenshot2](docs/Screenshot2.png)


## Development
* Download Repo
* Run `npm install`
* Modify code in `/src`
* Update Metadata in `/src/manifest.json` and `/package.json`
* Build plugin with `npm run dist`
* Update the plugin framework with `npm run update`
* Publish using `npm publish`

## Custom Theming
The following CSS classes and IDs are available for custom theming of the panel

```
#agendaBody  - ID for the main agenda body, the topmost HTML element in the side panel
#agendaHeading - ID for the main agenda heading. Its the one that says "Agenda" at the top of the panel
.agendaDate - Class for the date headings that separates the todo into days
.agendaTodo - Class for each todo paragraph, that every todo is contained in
.agendaTodoCheckbox - Class for each todo's completion checkbox
.agendaTodoTime - Class for each todo's time label
.agendaTodoTitle - Class for each todo's title link
```