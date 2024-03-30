import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import BaseEntry from "./base";

const hospitalSchema = new mongoose.Schema({
  discharge: {
    date: {
      type: Date,
      required: true,
    },
    criteria: {
      type: String,
      required: true,
    },
  },
  type: {
    type: String,
    required: true,
    enum: ["Hospital"],
  },
});

hospitalSchema.plugin(uniqueValidator);

const HospitalEntry = BaseEntry.discriminator("Hospital", hospitalSchema);

export default HospitalEntry;