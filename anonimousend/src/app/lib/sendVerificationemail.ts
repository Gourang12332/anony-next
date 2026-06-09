import { Resend } from "resend";
import { VerificationEmail } from "../../../Emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationemails(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "MysteryMessage@resend.dev",
      to: email,
      subject: "Verification Code",
      react: VerificationEmail({
        firstName: username,
        otp: verifyCode,
      }),
    });

    return {
      success: true,
      message: `User Registered and Verification mail sent.`,
    };
  } catch (error) {
    console.log("Error sending mail:", error);

    return {
      success: false,
      message: `Failed to send email due to sending mail limits. Don't worry, Your OTP is ${verifyCode}`,
    };
  }
}
