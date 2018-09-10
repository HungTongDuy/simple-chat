export const formatTime = (date) => {
    date = new Date(date);
    var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    var date_current = new Date();
    var day_current = date_current.getDate();
    var monthIndex_current = date_current.getMonth();

    if(day_current === day && monthIndex_current === monthIndex) {
        var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        return hours + ':' + min;
    }

    return monthNames[monthIndex] + ' ' + day + ', ' + year;
}