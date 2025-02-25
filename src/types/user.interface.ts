import { Document, Types } from "mongoose";
import ILog from "./log.interface";

export interface IUser extends Document {
  _id: Types.ObjectId;
  fName: string;
  lName?: string;
  email: string;
  mobile: string;
  password: string;
  isActive: boolean;
  lastLoggedInOn?: Date;
  refreshToken?: string;
  _logs: ILog;
}
