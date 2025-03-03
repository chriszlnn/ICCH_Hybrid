import { getVerificationTokenByEmail } from '@/data/verification-token';
import { v4 as uuidv4 } from 'uuid';
//import { database } from './database';
import { prisma } from './prisma';
import { getResetTokenByEmail } from '@/data/reset-password-token';

export const generateVerificationToken = async (email: string) => {
    // Generate a random token 
    const token = uuidv4();
    const expires = new Date().getTime() + 1000 * 60 * 60 * 1; // 1 hours

    // Check if a token already exists for the user
    const existingToken = await getVerificationTokenByEmail(email)

    if(existingToken) {
        await prisma.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    // Create a new verification token
    const verificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expires: new Date(expires)
        }
    })

    return verificationToken;
}


export const generateResetPasswordToken = async (email: string) => {
    // Generate a random token 
    const token = uuidv4();
    const expires = new Date().getTime() + 1000 * 60 * 60 * 1; // 1 hours

    // Check if a token already exists for the user
    const existingRPToken = await getResetTokenByEmail(email)

    if(existingRPToken) {
        await prisma.passwordResetToken.delete({
            where: {
                id: existingRPToken.id
            }
        })
    }

    // Create a new verification token
    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expires: new Date(expires)
        }
    })

    console.log(passwordResetToken)

    return passwordResetToken;
}

