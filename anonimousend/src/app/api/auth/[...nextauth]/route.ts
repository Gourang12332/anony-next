import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions) // which takes input authorizing options, github provider or our credentials provider

export {handler as GET, handler as POST}  // as next js is a framework , so GET OR POST is defined for handlers that is api's rwquest were managed by these verbs