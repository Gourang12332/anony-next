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
    <h1>Welcome, {firstName} {otp}!</h1>
  </div>
);


// i have copied the email template of the resend docs