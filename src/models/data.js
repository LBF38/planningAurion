const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const dataSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    calendarLink: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

dataSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Data", dataSchema);
