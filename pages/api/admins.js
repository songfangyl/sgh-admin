import { Admin } from "@/models/Admin";
import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    res.json(await Admin.find());
  }

  if (method === "POST") {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    try {
      const adminDoc = await Admin.create({ email });
      res.json(adminDoc);
    } catch (error) {
      res.status(500).json({ error: "Error adding admin" });
    }
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Admin.deleteOne({ _id });
    res.json("ok");
  }
}
