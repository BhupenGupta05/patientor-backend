import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export interface Diagnosis {
    code: string,
    name: string,
    latin?: string
}

const diagnosisSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  latin: String,
});

diagnosisSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

diagnosisSchema.plugin(uniqueValidator);
  
export default mongoose.model<Diagnosis>("Diagnosis", diagnosisSchema);