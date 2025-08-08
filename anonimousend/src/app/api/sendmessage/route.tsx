import dbconnect from "@/app/lib/dbconnect";
import UserModel from "@/app/models/User";

import { Message } from "@/app/models/User";

export async function POST(req:Request) {
    await dbconnect();

    try{
         const {username, content} = await req.json();
         
         const user = await UserModel.findOne({username});
         if(!user){
            return Response.json({
                message : "user not found"
            } , {
                status : 402
            })
         } else{
            const acceptingmessage = user.isAcceptingMessage;
            if(acceptingmessage){
                user.messages.push({content,createdAt : new Date()} as Message)   //  see without asserting it as Message there will be the typescript issue that this is not the message format , so u cannot push it to the user.message field
                user.save();

                return Response.json({
                    message : "message sent to the user successfully"
                },{
                    status : 200
                })
            } else{
                return Response.json({
                    message : "User is not accepting the message right now"
                } , {
                    status : 403
                })
            }
         }
    } catch(error){
        console.log("Error catching the user and sending message" , error)
        return Response.json({
            message :"Error sending the data"
        } , {
            status : 400
        })
    }
}

// input from request that ki username and content , that ki username jisko bhjna hai and content jo bhjna hai  array mein push kar dia