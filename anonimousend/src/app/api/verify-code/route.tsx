import dbconnect from "@/app/lib/dbconnect";
import UserModel from "@/app/models/User";
import { ok } from "assert";

export async function POST(request : Request) {
    await dbconnect()

    try {
     const {username, code} =  await request.json()   // fetching from url

     const decodeusername = decodeURIComponent(username);

     const user = await UserModel.findOne({
        username : decodeusername
     })

     if(!user){
        return Response.json({
            message : "user not exists"
        } , {
            status : 400
        })
     } else{
        const isCodeValid = code === user.verifyCode
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(!isCodeNotExpired){
            return Response.json({
                success : false,
                message : "your code has been expired create new code"
            } , {status : 400})
        } else if (!isCodeValid){
            return Response.json({
                success : false,
                message : "your code is invalid"
            } , {status : 400})
        } else{
            user.isVerified = true
            await user.save()
            return Response.json({
                success : true,
                message : "successfully verified"
            } , {status : 200})
        }
     }
    } catch (error) {
        console.error("Error verifying user" , error)

        return Response.json({
            success : false,
            message : "Error verifying user"
        } , {
            status : 500
        })
    }
}