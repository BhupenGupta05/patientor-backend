import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import BaseEntry from "./base";

const healthSchema = new mongoose.Schema({
  healthCheckRating: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  type: {
    type: String,
    required: true,
    enum: ["HealthCheck"],
  },
});

healthSchema.plugin(uniqueValidator);

const HealthEntry = BaseEntry.discriminator("Health", healthSchema);

export default HealthEntry;