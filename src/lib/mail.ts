import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = "https://icch-hybrid.vercel.app"

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmationLink = `${domain}/verify-email?token=${token}`

    await resend.emails.send({
        from: "onboarding@icch.online",
        to: email,
        subject: "Verify your email",
        html: `<p>Click <a href="${confirmationLink}">here</a> to verify your email.</p>`
    })
    console.log("(mail.ts)Email sent to:", email)
}

