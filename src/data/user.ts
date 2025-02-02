import { prisma } from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
    try {
        const lowerCaseEmail = email.toLowerCase();
        const user = await prisma.user.findUnique({
            where: {
                email: lowerCaseEmail
            }
        })

        return user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return null
    }
}

export const getUserById = async (id:string) => {
    try {
        const user = await prisma.user.findUnique({
        where: {
            id
        }
    }); 

    return user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return null
    }
}