import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import dbconnect from "@/app/lib/dbconnect";
import UserModel from "@/app/models/User";
import {User} from "next-auth"


export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
         name  : "credentials",
         credentials: {
            email: { label: "email", type: "text" },
            password: { label: "Password", type: "password" }
          },
        async authorize(credentials : any) : Promise<User | null>{
            // to acess the above parameters , use credentials. identifiers
            await dbconnect()
            try {
                console.log(credentials)
                const user = await UserModel.findOne({
                    $or:[
                        {email : credentials?.identifier},
                        {password: credentials?.password}
                    ]
                })
                console.log(typeof(user?.password))
                if(!user){
                    throw new Error("No user exist with this email")
                } else{
                    if(!user.isVerified){
                       throw new Error("Please verify your account")  // while sigining in if the user exist then we will check that either the user is verified or not if not then first he has to verify himself
                    } 
                    const ispasscorrect = await bcrypt.compare(credentials.password,user.password)
                    if(ispasscorrect){
                       return user as User
                    }else{
                       throw new Error("Incorrect password")
                    }
                    
                }
            } catch (e : any) {
                throw new Error(e)
            }
            }
        
        })
    ],
    callbacks : {
        async session({ session, token }) {
            if(token){
                session.user._id = token._id,
                session.user._isVerified = token._isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
          },
          async jwt({ token, user, }) {
            if(user){
               token._id = user._id?.toString();
               token.isVerified = user.isVerified;
               token.isAcceptingMessages = user.isAcceptingMessages;
               token.username = user.username;
            }
            return token
          }
    },
    pages : {
        signIn : '/sign-in'
    },
    session : {
        strategy : "jwt"
    },
    secret : process.env.NEXTAUTH_SECRET
} 