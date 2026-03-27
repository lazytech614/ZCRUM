"use server";

import prisma from "@/lib/prisma"
import { IssueType } from "@/types";
import { auth } from "@clerk/nextjs/server"

export async function createIssue({projectId, data}: {
    projectId: string,
    data: {
        title: string,
        description: string,
        status: "TODO" | "IN_PROGRESS" | "DONE" | "IN_REVIEW",
        priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT",
        sprintId: string,
        assigneeId?: string
    }
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

        const lastIssue = await prisma.issue.findFirst({
            where: {
                projectId: projectId,
                status: data.status
            },
            orderBy: {
                order: "desc"
            }
        })

        const newOrder = lastIssue ? lastIssue.order + 1 : 0

        const issue = await prisma.issue.create({
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                projectId: projectId,
                sprintId: data.sprintId,
                reporterId: user.id,
                assigneeId: data.assigneeId || null,
                order: newOrder
            },
            include: {
                assignee: true,
                reporter: true
            }
        })

        return issue
    }catch(err) {
        console.error("ERROR_IN_CREATE_ISSUE_SERVER_ACTION", (err as Error).message)
        throw new Error((err as Error).message)
    }
}

export async function getIssuesForSprint(sprintId: string) {
    try {
        const {userId, orgId} = await auth()

        if(!userId || !orgId) throw new Error("Unauthenticated")

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })

        if(!user) throw new Error("User not found")

        const sprint = await prisma.sprint.findUnique({
            where: {
                id: sprintId
            }
        })

        if(!sprint) throw new Error("Sprint not found")

        const issues = await prisma.issue.findMany({
            where: {
                sprintId
            },
            orderBy: [
                {
                    order: "asc"
                },
                {
                    status: "asc"
                }
            ],
            include: {
                assignee: true,
                reporter: true,
                sprint: true
            }
        })

        return issues.map(serializeIssue)
    }catch(err) {
        console.error("ERROR_IN_GET_ISSUES_FOR_SPRINT_SERVER_ACTION", (err as Error).message)
        throw new Error((err as Error).message)
    }
}

export async function deleteIssue(issueId: string) {
    try {
        const {userId, orgId, orgRole} = await auth()

        if(!userId || !orgId) throw new Error("Unauthenticated")

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })

        if(!user) throw new Error("User not found")

        const issue = await prisma.issue.findUnique({
            where: {
                id: issueId
            },
            include: {
                project: true
            }
        })

        if(!issue) throw new Error("Issue not found")

        if(orgRole !== "org:admin" && issue.project.organizationId !== orgId) throw new Error("You don't have permission to delete this issue")

        const deleted = await prisma.issue.delete({
            where: {
                id: issueId
            }
        })

        return {success: true, deleted}
    }catch(err) {
        console.error("ERROR_IN_DELETE_ISSUE_SERVER_ACTION", (err as Error).message)
        throw new Error((err as Error).message)
    }
} 

export async function updateIsuue(issueId: string, data: {
    status: "TODO" | "IN_PROGRESS" | "DONE" | "IN_REVIEW", 
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"}
) {
    try {
        const {userId, orgId} = await auth()

        if(!userId || !orgId) throw new Error("Unauthenticated")

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })

        if(!user) throw new Error("User not found")

        const issue = await prisma.issue.findUnique({
            where: {
                id: issueId
            },
            include: {
                project: true
            }
        })

        if(!issue) throw new Error("Issue not found")

        if(issue.project.organizationId !== orgId) throw new Error("You don't have permission to update this issue")

        const updatedIssue = await prisma.issue.update({
            where: {
                id: issueId
            },
            data: {
                status: data.status,
                priority: data.priority,
            },
            include: {
                assignee: true,
                reporter: true
            }
        })

        return updatedIssue
    }catch(err) {
        console.error("ERROR_IN_UPDATE_ISSUE_SERVER_ACTION", (err as Error).message)
        throw new Error((err as Error).message)
    }
}

export async function updateIssueOrder(updatedIssues: IssueType[]) {
   try {
        const {userId, orgId} = await auth()

        if(!userId || !orgId) throw new Error("Unauthenticated")

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })

        if(!user) throw new Error("User not found")

        await prisma.$transaction(async (tx) => {
            for(const issue of updatedIssues) {
                await tx.issue.update({
                    where: {
                        id: issue.id
                    },
                    data: {
                        status: issue.status,
                        order: issue.order
                    }
                })
            }
        })

        return {success: true}
   }catch(err) {
        console.error("ERROR_IN_UPDATE_ISSUE_ORDER_SERVER_ACTION", (err as Error).message)
        throw new Error((err as Error).message)
   } 
}

function serializeIssue(issue: any) {
  return {
    ...issue,
    createdAt: issue.createdAt?.toISOString?.(),
    updatedAt: issue.updatedAt?.toISOString?.(),

    sprint: issue.sprint
      ? {
          ...issue.sprint,
          createdAt: issue.sprint.createdAt?.toISOString?.(),
          updatedAt: issue.sprint.updatedAt?.toISOString?.(),
        }
      : null,

    assignee: issue.assignee
      ? {
          ...issue.assignee,
          createdAt: issue.assignee.createdAt?.toISOString?.(),
          updatedAt: issue.assignee.updatedAt?.toISOString?.(),
        }
      : null,

    reporter: issue.reporter
      ? {
          ...issue.reporter,
          createdAt: issue.reporter.createdAt?.toISOString?.(),
          updatedAt: issue.reporter.updatedAt?.toISOString?.(),
        }
      : null,
  };
}

export async function getUserIssues(userId: string) {
    try {
        const {orgId} = await auth()

        if(!userId || !orgId) throw new Error("Unauthenticated")

        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })

        if(!user) throw new Error("User not found")

        const issues = await prisma.issue.findMany({
            where: {
                OR: [
                    {assigneeId: user.id},
                    {reporterId: user.id}
                ],
                project: {
                    organizationId: orgId
                }
            },
            include: {
                assignee: true,
                reporter: true,
                project: true
            },
            orderBy: {
                updatedAt: "desc"
            },
        })

        return issues
    }catch(err) {
        console.error("ERROR_IN_GET_USER_ISSUES_SERVER_ACTION", (err as Error).message)
        throw new Error((err as Error).message)
    }
}