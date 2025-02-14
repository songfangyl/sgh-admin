import { mongooseConnect } from "@/lib/mongoose";
import { Booking } from "@/models/Booking";

export default async function handle(req, res) {
  await mongooseConnect();

  if (req.method === "POST") {
    try {
      const { products, date, time } = req.body;
      const booking = await Booking.create({ products, date, time });

      return res.status(201).json(booking);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create booking." });
    }
  }

  if (req.method === "GET") {
    try {
      const bookings = await Booking.find().populate("products");
      return res.status(200).json(bookings);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch bookings." });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
