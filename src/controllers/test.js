const { default: ical } = require("ical-generator");
const moment = require("moment");

console.log("test");
console.log(new Date("2023-02-01T15:40:00.000"));
console.log(new Date("2023-02-01T15:40:00.000").getTime());
console.log(isNaN(new Date("2023-02-01T15:40:00.000").getTime()));
console.log(moment("2023-02-01T15:40:00.000").format("YYYYMMDDThhmmss"));
const calendar = ical({name: "Test Calendar", domain: "test.com"});
calendar.createEvent({
    start: new Date("2023-02-01T15:40:00.000"),
    end: new Date("2023-02-01T15:40:00.000"),
    summary: "Test Event",
    description: "Test Event Description",
    location: "Test Location",
    url: "https://test.com",
    uid: "test"
});
calendar.save("test.ics");
console.log(calendar);
console.log(calendar.events());