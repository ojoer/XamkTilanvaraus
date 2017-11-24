/* eslint-disable */

$(document).ready(function() {
    var initialLocaleCode = 'fi';

    

    $('#calendar').fullCalendar({
        
        header: {
            left: 'prev,next',
            center: 'title',
            right: 'agendaWeek,agendaDay'
        },
        eventSources: [
                    {
                        method : "get",
                        url : "http://localhost:9000/scripts/kalenteri/juhlapaivat.json",
                        color: 'red'
                    }

                ],
        defaultDate: '2017-11-17',
        defaultView: 'agendaWeek',
        allDaySlot: false,
        titleFormat: 'DD, MM, YYYY',
        locale: initialLocaleCode,
        showNonCurrentDates: false,
        buttonIcons: false, // show the prev/next text
        weekNumbers: true,
        navLinks: true, // can click day/week names to navigate views
        slotDuration: '01:00:00',
        minTime: '01:00:00',
        validRange: function(nowDate) {
            return {
                start: nowDate.add(6, 'days')
            };
        },
        businessHours: true,
        // display business hours
        businessHours: {
            // days of week. an array of zero-based day of week integers (0=Sunday)
            dow: [ 1, 2, 3, 4, 5, 6 ], // Monday - Thursday

            start: '8:00', // a start time (10am in this example)
            end: '20:00', // an end time (6pm in this example)
        },
        editable: true,
        eventStartEditable:false,
        eventDurationEditable:false,
        eventOverlap:false,
        selectable: true,
        selectHelper: true,
        selectOverlap:false,
        selectConstraint:"businessHours",
        select: function(start, end) {
            var title = prompt('Event Title:');
            var eventData;
            if (title) {
                eventData = {
                    title: title,
                    start: start,
                    end: end,
                    isNew: true
                };
                $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
            }
            $('#calendar').fullCalendar('unselect');
        }
    });
   
});