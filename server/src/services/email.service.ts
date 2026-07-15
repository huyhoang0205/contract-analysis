import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPremiumConformationEmail = async (userEmail: string, userName:string) => {
    try {
        await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: userEmail,
          subject: "Welcome to Premium",
          html: `<p>Hi ${userName},</p><p>Welcome to Resend. You're now a premium user</p>`,
        });
    } catch (e) {   
        console.log(e);
    }
}