import { prisma } from "@/lib/prisma";

export const getResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
        where: {
            email: email
        }
    })

    return passwordResetToken;
  } catch (error) {
    console.log(error);
  }
}

export const getResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
        where: {
            token: token
        }
    })

    return passwordResetToken;
  } catch (error) {
    console.log(error);
  }

}