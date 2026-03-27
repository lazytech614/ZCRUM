"use server";

import prisma from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug: any) {
    try {
        const {userId} = await auth()

        if(!userId) throw new Error("Unauthenticated")

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })

        if(!user) throw new Error("User not found")

        const client = await clerkClient();

        const organization = await client.organizations.getOrganization({
            slug
        })

        if(!organization) return null

        const {data: membership} = await client.organizations.getOrganizationMembershipList({
            organizationId: organization.id
        })

        const userMembership = membership.find((member: any) => member.publicUserData.userId === userId)

        if(!userMembership) return null

        return organization
    }catch(err) {
        console.error("ERROR_IN_GET_ORGANIZATION_SERVER_ACTION", (err as Error).message)
        throw new Error((err as Error).message)
    } 
}

export async function getOrganizationUsers(orgId: string) {
    try {
        const {userId} = await auth()

        if(!userId) throw new Error("Unauthenticated")

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })

        if(!user) throw new Error("User not found")

        const client = await clerkClient();

        const organizationMembership = await client.organizations.getOrganizationMembershipList({
            organizationId: orgId
        })

        const userIds = organizationMembership.data.map((member: any) => member.publicUserData.userId)

        const users = await prisma.user.findMany({
            where: {
                clerkUserId: {
                    in: userIds
                }
            }
        })

        return users
    }catch(err) {
        console.error("ERROR_IN_GET_ORGANIZATION_USERS_SERVER_ACTION", (err as Error).message)
    }
}