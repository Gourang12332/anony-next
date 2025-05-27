import dbconnect from "@/app/lib/dbconnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/app/models/User";


export async function DELETE(request : Request , {params} : {params : {messageid : string}})
{
    const messageid = params.messageid;
    await dbconnect();
    const session = await getServerSession(authOptions);
    const user = session?.user

    if(!session || session.user){
        return Response.json({
            success : false,
            message : "Not a valid user"
        },
    {status : 400})
    }

    try {
        const result = await UserModel.updateOne(
            {_id : user._id},{$pull : {messages : {_id : messageid}}}
        )
        if(result.modifiedCount == 0){
            return Response.json({
                success : false,
                message : "Unable to delete the message"
            },
        {status : 500})
        } else{
            return Response.json({
                success : "true",
                message : "successfully delted the  message"
            },
        {status : 200});
        }
    } catch (error) {
        console.log("Error in the delete-message-route");
        return Response.json({
                success : false,
                message : "Error deleting the message"
            },
        {status : 500})
    }

}