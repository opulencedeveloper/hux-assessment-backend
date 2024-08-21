import mongoose, { Document } from "mongoose";

export interface IContact extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  creatorId: string;
}

export interface IContactInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export type ContactParams = {
  contactId: string;
}
