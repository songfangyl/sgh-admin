import mongoose, { model, models, Schema } from "mongoose";

const AdminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export const Admin = models?.Admin || model("Admin", AdminSchema);