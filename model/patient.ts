import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

interface Patient {
  name: string;
  dateOfBirth: Date;
  ssn: string;
  gender: "male" | "female" | "other";
  occupation: string;
  entries: mongoose.Schema.Types.ObjectId[]; 
}

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  ssn: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },
  occupation: {
    type: String,
    required: true,
  },
  entries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Base",
    }
  ]
});
  
patientSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

patientSchema.plugin(uniqueValidator);
  
export default mongoose.model<Patient>("Patient", patientSchema);