import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("neighboraidDB");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

   emailAndPassword: { 
    enabled: true, 
  },

  socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

});