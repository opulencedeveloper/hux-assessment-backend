import mongoose, { Schema } from "mongoose";

import { IUser } from "./interface";

const userSchema: Schema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
