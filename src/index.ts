/** Imports *****************************************************************************************************************************************/
import joplin from 'api';
import { setupPanel } from './GUI/Panel/Panel';


/** Plugin Registration *****************************************************************************************************************************
 * Registers the plugin with joplin.                                                                                                                *
 ***************************************************************************************************************************************************/
joplin.plugins.register({                                           // calls the register function
    onStart: setupPanel                                             // Sets the onStart function to main
});
