import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  otp : string;
}

export const VerificationEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  otp
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>This is your OTP {otp}</p>
  </div>
);


// basically this is the template for email which will be send to the user, by the way if i use supabase , then this work can be done in just simple lines of code.and more easily
