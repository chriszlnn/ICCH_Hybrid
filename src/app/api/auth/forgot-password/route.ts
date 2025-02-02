import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { sendPasswordResetEmail } from '@/utils/sendEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function POST(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  
    const { email } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      res.json({ message:email });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const token = uuidv4(); // Generate a unique token
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Token expires in 1 hour

      await prisma.passwordResetToken.create({
        data: {
          token,
          userId: user.id,
        },
      });

      await sendPasswordResetEmail(email, token);
      res.json({ message: user.email });
      res.status(200).json({ message: 'Password reset link sent' });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
 
}



export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['chrislynjules@gmail.com'],
      subject: 'Hello world',
      react: await EmailTemplate({ firstName: 'John' }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}