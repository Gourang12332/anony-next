import dbconnect from "@/app/lib/dbconnect";
import UserModel from "@/app/models/User";
import {z} from "zod"
import { UsernamValidation } from "@/app/Schemas/signUpScheam";

// creating a query schema as per the standards

const usernameQuerySchema = z.object({
    username : z.string().min(1) 
}) // this will create a schema , of username only and similarly u can make for email and all
// writing get method to check that the username is valid or not , so making a function to avoid much api calls

export async function GET(request:Request) {
   // request methods are already handled in next 15 
    await dbconnect()
    try { // username will be checked here by the url , extracting the query
         const {searchParams} = new URL(request.url) 
         const queryparams =  searchParams.get('username')

         console.log("parameter got : " + queryparams);
         // to validate 
         
         const result  = await usernameQuerySchema.safeParseAsync({username : queryparams})
         console.log(" I am checking the result of safeparsing method in route.ts" + result);
         console.log(result);
         console.log(result.success + " " + queryparams?.length);
         if(!result.success){

            const usernameErrors = result.error.format().username?._errors || []
             // result .error .format will return array of all the errors ,but i want only the username errors , taking out is not madatory
            return Response.json({
               success : false,
               message : usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query params'
            } , {
              status : 400
            })
         }
         // result.data is carrying the username if the safeparsing goes successed and if failure then above code
         const username = result.data.username;
        const existingVerifiedUser =  await UserModel.findOne({username , isVerified : true})
        if(existingVerifiedUser){
            return Response.json({
                success: true,
                message : "The username is already been used"
            },
        {
            status : 400
        })
        } else{
            return Response.json({
                success: true,
                message : "The username is unique"
            },
        {
            status : 400
        })
        }
    } catch (error) {
        console.log(error)
        return Response.json(
            {
                success : false,
                message : "Error checking username"
            } ,
            {
                status : 500
            }
        )
    }
}


// we are first checking that either the username is in the standard format or not , if it is , then we are chekcing that if a verfied user is there with the username then this usernaem cannot be assigned to the new one