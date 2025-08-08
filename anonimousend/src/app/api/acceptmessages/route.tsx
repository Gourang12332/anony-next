import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbconnect from "@/app/lib/dbconnect";
import UserModel from "@/app/models/User";
import {User} from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options";
import { boolean } from "zod";


export async function POST(req : Request){
    await dbconnect()

    const session = await getServerSession(authOptions)
    const user  = session?.user as User  // this as User declaration in neccessary

    if(!session || !user){
        return Response.json({
            message : "User not authenticated"
        } , {
            status: 400
        })
    } 
    
   try {
    const {acceptmessage} = await req.json();
    
    const userId = user._id;
    const updateduser = await UserModel.findByIdAndUpdate(
        userId,
        
        {isAcceptingMessage : acceptmessage},
        {new : true}
    )
    if(updateduser){
        return Response.json({
            success : true,
            message : "successfully toggled switch"
        } , {
            status : 200
        })
    }else{
        return Response.json({
            success : false,
            message : "user accepting toggling variable not updated in user " + updateduser
        } , {
            status : 401
        })
    }
   } catch (error) {
    console.log("failed to update user status to accept messages" , error)
    return Response.json({
        success : false,
        message : "error toggling switch"
    } , {
        status : 500
    })
   }

}


// this is the get request to get the status that are we accepting the message or declining the message
export async function GET(req:Request) {
    await dbconnect()

    const session = await getServerSession(authOptions)
    const user  = session?.user as User  // this as User declaration in neccessary

    if(!session || !user){
        return Response.json({
            message : "User not authenticated"
        } , {
            status: 400
        })
    } 

    try {
        const userId = user._id;
    const founduser = await UserModel.findById(userId);
    if(founduser){
        return Response.json({
            success : true,
            isAcceptingmessage : founduser.isAcceptingMessage
        } , {
            status : 200
        })
    }else{
        return Response.json({
            success : false,
            message : "user not found"
        } , {
            status : 404
        })
    }
    } catch (error) {
        console.log("failed to update user status to accept messages" , error)
    return Response.json({
        success : false,
        message : "error toggling switch"
    } , {
        status : 500
    })
    }
} 