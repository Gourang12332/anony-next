import {z} from 'zod'
// using zod validation becomes much easier at frontend side
export const    UsernamValidation = z
    .string()
    .min(2,"Username must be atleast 2 characters")
    .max(20,"Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special character") //has used regex to confirm no special character comes

export const signUpSchema = z . object({
    username : UsernamValidation,
    email : z.string().email({message : 'Invalid email address'}),
    password : z.string().min(6,"Password must be of length 6")
}) 