import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userCalendarSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    calendarLink: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

userCalendarSchema.plugin(uniqueValidator);

export default mongoose.model("UserCalendar", userCalendarSchema);
