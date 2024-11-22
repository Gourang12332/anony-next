import dbconnect from "@/app/lib/dbconnect";
import UserModel from "@/app/models/User";
import bcrypt from 'bcrypt'
import { sendVerificationemails } from "@/app/lib/sendVerificationemail";

export async function POST(request:Request) {
    await dbconnect()

    try {
        const {username,email,password} = await request.json()
        const existinguserverifiedbyusername  =  await UserModel.findOne({
            username,isVerified : true
        })
        const existinguserByemail  = await UserModel.findOne({email})
       if (existinguserverifiedbyusername){  
        return Response.json({
            success : true,
            message : "username already taken",
            status : 400,
        })
       }
       const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
       if(existinguserByemail){

       } else{
        // if by email is not existing then , register the new man
         const hashedpass = bcrypt.hash(password,10)  
         const expirydate = new Date(); // using Date constructior to create the object
         expirydate.setHours(expirydate.getHours() + 1); // expirydate.getHours method will return the current hours of the time stamp
         const newUser = new UserModel(
           {
            username,
            email,
            password,
            verifyCode,
            expirydate,
            isVerified : false,
            isAcceptingMessage : false,
            message : []
           }
         )
         await newUser.save()
       } 
       // sending the verification mails to the user
       const emailResponse = await sendVerificationemails(email,username,verifyCode)

    } catch (error) {
        console.error("This error is in the signup post request",error)
        return Response.json({
            success : false,
            message : "This error is in the sign up page",
            status : 500,
        })
    }
}

// there is not a shit like const async respnse