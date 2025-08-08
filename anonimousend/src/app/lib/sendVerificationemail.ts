import {resend} from './resend'
import { VerificationEmail } from '../../../Emails/VerificationEmail'
import { ApiResponse } from '../types/ApiResponse'

// have to send verification email

export async function sendVerificationemails(
    email : string,
    username : string,
    verifyCode : string,

): Promise<ApiResponse> {
    try {
         await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Hello world',
            react: VerificationEmail({firstName : username,otp : verifyCode}),
          });
        return {success :true,message : "Verification mail send"}
    } catch (error) {
        console.log("Error sending mails")
        return {success :false,message : `Failed to send email due to sending mail limits. Don't worry, Your OTP is ${verifyCode}`}
    }
}

