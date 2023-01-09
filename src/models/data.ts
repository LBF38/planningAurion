import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const dataSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    calendarLink: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

dataSchema.plugin(uniqueValidator);

export default mongoose.model("Data", dataSchema);
