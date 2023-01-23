import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userCalendarSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    aurionToken: { type: String, required: true },
    calendarLink: { type: String, required: true, unique: true },
    startDate: { type: Date },
    endDate: { type: Date },
    calendarContent: { type: String },
  },
  { timestamps: true }
);

userCalendarSchema.plugin(uniqueValidator);

export default mongoose.model("UserCalendar", userCalendarSchema);
