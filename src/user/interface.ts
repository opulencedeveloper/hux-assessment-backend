import { Document } from "mongoose";

export interface IUser extends Document {
  userName: string;
  password: string
}

export interface IUserInput {
  userName: string;
  password: string;
}