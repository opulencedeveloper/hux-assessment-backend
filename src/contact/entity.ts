import mongoose, { Schema } from "mongoose";

import { IContact } from "./interface";

const contactSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  creatorId: { type: String, required: true },
});

const Contact = mongoose.model<IContact>("Contact", contactSchema);

export default Contact;
