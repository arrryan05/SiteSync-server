import NextAuth, { NextAuthOptions } from "next-auth";
import authOptions from "../../config/authOptions";

export default NextAuth(authOptions as NextAuthOptions);
