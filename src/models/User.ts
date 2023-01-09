import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    token: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

export default mongoose.model("User", userSchema);
