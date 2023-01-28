import ical from "ical-generator";
import moment from "moment";

const cal = ical({ name: "My first iCal" });
cal.createEvent({
  start: moment("2023-01-30T20:00:00.000Z"),
  end: new Date(new Date().getTime() + 3600000),
  summary: "Event #1",
  description: "Event #1 Description",
  location: "Event #1 Location",
});
const event = cal.createEvent({});
event.start(moment("2023-01-30T20:00:00.000Z"));
event.end(moment("2023-01-30T17:35:00.000"));
// console.log(cal.toString());
console.log(event.toString());
