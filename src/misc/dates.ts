
export function getStartOfToday(){
    var startOfToday = new Date()
    startOfToday.setHours(0,0,0,0);
    return startOfToday    
}

export function getEndOfToday(){
    var endOfToday = new Date();
    endOfToday.setHours(23,59,59,999);
    return endOfToday   
}

export function getEndOfThisWeek(){
    var endOfWeek = new Date()
    endOfWeek.setDate(endOfWeek.getDate() - (endOfWeek.getDay() - 1) + 6);
    endOfWeek.setHours(23,59,59,999); 
    return endOfWeek;    
}

export function getEndOfThisMonth(){
    var endOfMonth = new Date()
    endOfMonth = new Date(endOfMonth.getFullYear(), endOfMonth.getMonth() + 1, 0);
    return endOfMonth    
}

export function getEndOfThisYear(){
    var endOfYear = new Date(new Date().getFullYear(), 11, 31) 
    return endOfYear
}
