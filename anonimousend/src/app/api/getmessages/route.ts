// here to get the messages for the logged in user

import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbconnect from "@/app/lib/dbconnect";
import UserModel from "@/app/models/User";
import {User} from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(req : Request){
     await dbconnect()
    
        const session = await getServerSession(authOptions)
        const user  = session?.user as User  // this as User declaration in neccessary
        console.log("The user is " + user.username)
        if(!session || !user){
            return Response.json({
                success : false,
                message : "User not authenticated"
            } , {
                status: 400
            })
        } 
    const userId = new mongoose.Types.ObjectId(user._id);
        
    try {
        const user  = await UserModel.aggregate([
            {$match : {_id : userId}},
            {$unwind : '$messages'},
            {$sort : {'messages.createdAt' : -1}},
            {$group : {_id : '$_id' , messages : {$push : '$messages'}}}
        ])
        
        if(!user || user.length === 0){
            return Response.json({
                success : false,
                message : "No Messages Found"
            } , {
                status : 400
            })
        }
        // console.log(user)
        return Response.json({
            message : user[0].messages,
            success : true,
        } , {
            status : 200
        })
    } catch (error) {

        console .log("Error is their for finding message" + error)
        return Response.json({
            success : false,
            message : "error finding user messages"
        } , {
            status : 500
        })
    }
}