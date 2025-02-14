import mongoose, { Schema, model, models } from "mongoose";

const BookingSchema = new Schema({
  products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
  date: { type: String, required: true },
  time: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Booking = models?.Booking || model("Booking", BookingSchema);
