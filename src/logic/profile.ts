/** Profile *****************************************************************************************************************************************
 * This data class represents a specific Agenda profile that customizes the presentation of the panels and notes                                    *
 ***************************************************************************************************************************************************/
export class Profile {
    public name = 'New Profile'
    public searchCriteria = ''
    public noteID = ""
    public showCompleted = false
    public showNoDue = false
    public displayFormat = 'interval'
    public yearFormat = 'numeric'
    public monthFormat = 'long'
    public dayFormat = 'numeric'
    public weekdayFormat = 'long'
    public timeIs12Hour = true
}
