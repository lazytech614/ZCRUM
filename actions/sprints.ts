"use server";

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { isAfter, isBefore } from "date-fns";

export async function createSprint({
    projectId, 
    name, 
    startDate, 
    endDate
} : {
    projectId: string, 
    name: string, 
    startDate: Date, 
    endDate: Date
}) {
    try {
        const {userId, orgId } = await auth()

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
            }
        })

        if(!project) throw new Error("Project not found")

        if(project.organizationId !== orgId) throw new Error("You don't have permission to create sprints for this project")

        const sprint = await prisma.sprint.create({
            data: {
                name,
                startDate,
                endDate,
                projectId,
                status: "PLANNED"
            }
        })

        return {success: true, sprint}
    }catch(err) {
        console.error("ERROR_IN_CREATE_SPRINT_SERVER_ACTION", (err as Error).message)
        throw new Error((err as Error).message)
    }
}

export async function updateSprintStatus(sprintId: string, newStatus: "ACTIVE" | "PLANNED" | "COMPLETED" ) {
    try {
        const {userId, orgId, orgRole } = await auth()

        if(!userId || !orgId) throw new Error("Unauthenticated")

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })

        if(!user) throw new Error("User not found")

        if(orgRole !== "org:admin") throw new Error("Only organization admins can update sprints")

        const sprint = await prisma.sprint.findUnique({
            where: {
                id: sprintId
            },
            include: {
                project: true
            }
        })

        if(!sprint) throw new Error("Sprint not found")

        if(sprint.project.organizationId !== orgId) throw new Error("You don't have permission to update this sprint")

        const now = new Date()
        const startDate = new Date(sprint.startDate)
        const endDate = new Date(sprint.endDate)

        if(newStatus === "ACTIVE" && (now < startDate || now > endDate)) throw new Error("Cannot start sprint before start date or after end date")

        if(newStatus === "COMPLETED" && sprint.status !== "ACTIVE") throw new Error("Can only complete sprints that are active")

        const updatedSprint = await prisma.sprint.update({
            where: {
                id: sprintId
            },
            data: {
                status: newStatus
            }
        })

        return {success: true, sprint: updatedSprint}
    }catch(err) {
        console.error("ERROR_IN_UPDATE_SPRINT_STATUS_SERVER_ACTION", (err as Error).message)
        throw new Error((err as Error).message)
    }
}