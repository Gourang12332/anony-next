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
       console.log("verify code:" + verifyCode)
       if(existinguserByemail){
         if(existinguserByemail.isVerified){
            return Response.json({
                success : false,
                message :"User already verified"
            } , {status : 400})
         } else {
            const hashpass = await bcrypt.hash(password, 10) // 10 rounds of encryption
            existinguserByemail.password = hashpass;
            existinguserByemail.verifyCode = verifyCode;
            existinguserByemail.verifyCodeExpiry = new Date(Date.now() + 360000)  // added 3600000 miliseconds that is one hour in Date.now()

            await existinguserByemail.save()
         }
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
       // sending the verification mails to the user either after creating a new account or having unverified account , unverified accounts are teh accounts which have not typed the correct otp in time
       const emailResponse = await sendVerificationemails(email,username,verifyCode)
       console.log("Email : " + email + "Verify-Code : " + verifyCode);
       if(!emailResponse.success){
        return Response.json({
          success : false,
          message : emailResponse.message
        },{status : 500})
       }
       return Response.json({
        success : false,
        message : "User registered successfully , verify your email"
      },{status : 500})

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

// check for the username as it is verified or not , so that we can tell that , either the man can pick that username or not , afterward we can check through mail.
//check for the verificationby email , that is it is verified by mail or not , if verified return response verified but if not verified then create a new verificatio code for them to verify them if userbyemail is not existing , then create a new user