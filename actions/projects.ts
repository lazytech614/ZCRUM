"use server";

import prisma from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createProject(data: { name: string, key: string, description: string }) {
    try {
        const {userId, orgId} = await auth()

        if(!userId) throw new Error("Unauthenticated")

        if(!orgId) throw new Error("No organization selected")

        const client = await clerkClient();

        const {data: membership} = await client.organizations.getOrganizationMembershipList({
            organizationId: orgId
        })

        const userMembership = membership.find((member: any) => member.publicUserData.userId === userId)

        if(!userMembership) throw new Error("You are not a member of this organization")

        if(userMembership.role !== "org:admin") throw new Error("Only organization admins can create projects")

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })

        if(!user) throw new Error("User not found")

        const project = await prisma.project.create({
            data: {
                name: data.name,
                key: data.key,
                description: data.description,
                organizationId: orgId,
            }
        })

        return project
    }catch(err) {
        console.error("ERROR_IN_CREATE_PROJECT_SERVER_ACTION", (err as Error).message)
        throw new Error((err as Error).message)
    }
}

export async function fetchProjects(orgId: string) {
    try {
        const {userId} = await auth()

        if(!userId) throw new Error("Unauthenticated")

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })

        if(!user) throw new Error("User not found")

        const projects = await prisma.project.findMany({
            where: {
                organizationId: orgId
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return projects
        
    }catch(err) {
        console.error("ERROR_IN_FETCH_PROJECTS_SERVER_ACTION", (err as Error).message)
        throw new Error((err as Error).message)
    }
}

export async function deleteProject(projectId: string) {
    try {
        const {userId, orgId, orgRole} = await auth()

        if(!userId || !orgId) throw new Error("Unauthenticated")

        if(orgRole !== "org:admin") throw new Error("Only organization admins can delete projects")

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })

        if(!user) throw new Error("User not found")

        const project = await prisma.project.findUnique({
            where: {
                id: projectId
            }
        }) 

        if(!project) throw new Error("Project not found")

        if(project.organizationId !== orgId) throw new Error("You don't have permission to delete this project")

        const deleted = await prisma.project.delete({
            where: {
                id: projectId
            }
        })

        return {success: true, deleted}
    }catch(err) {
        console.error("ERROR_IN_DELETE_PROJECT_SERVER_ACTION", (err as Error).message)
        throw new Error((err as Error).message)
    }
}

export async function getProject(projectId: string) {
    try {
        const {userId, orgId} = await auth()

        if(!userId || !orgId) throw new Error("Unauthenticated")

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })

        if(!user) throw new Error("User not found")

        const project = await prisma.project.findUnique({
            where: {
                id: projectId
            }, 
            include: {
                sprints: {
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        })

        if(!project) return null

        if(project.organizationId !== orgId) return null

        return project
    }catch(err) {
        console.error("ERROR_IN_GET_PROJECT_SERVER_ACTION", (err as Error).message)
        throw new Error((err as Error).message)
    }
}