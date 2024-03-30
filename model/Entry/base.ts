import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const baseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  specialist: {
    type: String,
    required: true,
  },
  diagnosisCodes: [
    {
      type: String, 
      ref: "Diagnosis",
    }
  ],
  description: {
    type: String,
    required: true,
  },
});

baseSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

baseSchema.plugin(uniqueValidator);

const BaseEntry = mongoose.model("Base", baseSchema);

export default BaseEntry;