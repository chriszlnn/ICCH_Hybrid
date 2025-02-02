import { prisma } from "@/lib/prisma";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
        where: {
            email: email
        }
    })

    return verificationToken;
  } catch (error) {
    console.log(error);
  }

}

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
        where: {
            token: token
        }
    })

    return verificationToken;
  } catch (error) {
    console.log(error);
  }

}