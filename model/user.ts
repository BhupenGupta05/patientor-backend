import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export interface UserInterface {
  name: string,
  username: string,
  passwordHash: string,
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    requried: true,
    unique: true,
  },
  passwordHash: String,
});
  
userSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  }
});

userSchema.plugin(uniqueValidator);
  
const User = mongoose.model<UserInterface>("User", userSchema);

export default User;