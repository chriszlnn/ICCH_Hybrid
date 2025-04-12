import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = "https://icch-hybrid.vercel.app"


export const sendResetPasswordEmail = async (email: string, token: string) => {
    const forgotPasswordLink = `${domain}/forgot-password?token=${token}`;
  
    await resend.emails.send({
      from: "onboarding@icch.online",
      to: email,
      subject: "Reset Password",
      html: `<p>Click <a href="${forgotPasswordLink}">here</a> to reset your password.</p>`,
    });
  
    console.log("(mail.ts) Email sent to:", email); 
  };

  