import { currentUser } from "@clerk/nextjs/server"
import prisma from "./prisma"

export const checkUser = async () => {
    const user = await currentUser()

    if(!user) return null

    try {
        const loggedInUser = await prisma.user.findUnique({
            where: {
                clerkUserId: user.id
            }
        })

        if(loggedInUser) return loggedInUser

        const newUser = await prisma.user.create({
            data: {
                clerkUserId: user.id,
                name: user.firstName + " " + user.lastName,
                email: user.emailAddresses[0].emailAddress,
                imageUrl: user.imageUrl
            }
        })

        return newUser
    }catch(err) {
        console.error((err as Error).message)
        return null
    }
}