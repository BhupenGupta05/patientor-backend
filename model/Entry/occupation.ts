import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import BaseEntry from "./base";

const occupationSchema = new mongoose.Schema({
  employerName: {
    type: String,
    required: true,
  },
  sickLeave: {
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  type: {
    type: String,
    required: true,
    enum: ["OccupationalHealthcare"],
  },
});

occupationSchema.plugin(uniqueValidator);

const OccupationalHealthcareEntry = BaseEntry.discriminator("Occupation", occupationSchema);

export default OccupationalHealthcareEntry;