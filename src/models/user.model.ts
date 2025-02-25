import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types/user.interface";

const UserSchema = new Schema<IUser>(
  {
    fName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [2, "First name must have at least 2 characters"],
      maxlength: [30, "First name cannot exceed 30 characters"],
    },
    lName: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => /^[6-9]\d{9}$/.test(v),
        message: "Invalid 10-digit Indian mobile number",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [5, "Password must be at least 5 characters"],
    },
    isActive: { type: Boolean, default: true },
    lastLoggedInOn: { type: Date },
    refreshToken: { type: String },
    _logs: {
      createdOn: { type: Date, default: Date.now },
      createdBy: { type: String, default: "system" },
      lastModifiedOn: { type: Date },
      lastModifiedBy: { type: String },
    },
  },
  { timestamps: false }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Auto-update logs on modification
UserSchema.pre<IUser>("save", function (next) {
  if (this.isModified()) {
    this._logs.lastModifiedOn = new Date();
    this._logs.lastModifiedBy = this.isNew ? "system" : "user";
  }
  next();
});

export const User = model<IUser>("User", UserSchema);
