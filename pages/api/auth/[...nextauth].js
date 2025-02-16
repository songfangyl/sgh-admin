import NextAuth, {getServerSession} from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { Admin } from '@/models/Admin';
import { mongooseConnect } from '@/lib/mongoose';


export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session, token, user }) => {
      if (!session?.user?.email) {
        throw new Error("No email found in session");
      }

      try {
        await mongooseConnect();

        // Query database to check if user is an admin
        const isAdmin = await Admin.findOne({ email: session.user.email });

        if (!isAdmin) {
          throw new Error("Unauthorized: User is not an admin");
        }

        return session; // Return valid session
      } catch (error) {
        console.error("Session Error:", error.message);
        throw new Error(error.message || "Authentication error"); // Throw error instead of returning session
      }
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req,res) {
  await mongooseConnect();
  const session = await getServerSession(req,res,authOptions);
  if (!await Admin.findOne({email: session?.user?.email})) {
    res.status(401);
    res.end();
    throw 'not an admin';
  }
}
