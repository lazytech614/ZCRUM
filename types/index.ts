import { Prisma } from "@/app/generated/prisma/client";

// Generic helper to make relations optional
export type WithOptionalRelations<T extends object, Relations extends keyof T> = Omit<T, Relations> & {
  [K in Relations]?: T[K];
};

export type UserType = WithOptionalRelations<
  Prisma.UserGetPayload<{ include: { createdIssues: true; assignedIssues: true } }>,
  "createdIssues" | "assignedIssues"
>;

export type IssueType = WithOptionalRelations<
  Prisma.IssueGetPayload<{ include: { assignee: true; reporter: true; project: true; sprint: true } }>,
  "assignee" | "reporter" | "project" | "sprint"
>;

export type ProjectType = WithOptionalRelations<
  Prisma.ProjectGetPayload<{ include: { sprints: true; issues: true } }>,
  "sprints" | "issues"
>;

export type SprintType = WithOptionalRelations<
  Prisma.SprintGetPayload<{ include: { project: true; issues: true } }>,
  "project" | "issues"
>;