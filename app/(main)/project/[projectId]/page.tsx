import { getProject } from "@/actions/projects";
import SprintBoard from "@/components/project/sprint-board";
import SprintCreationForm from "@/components/project/sprint-create-form";
import { notFound } from "next/navigation";

export default async function ProjectPage({ params }: any) {
  const { projectId } = await params;

  console.log("ProjectId_1: ", projectId)

  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      <SprintCreationForm
        projectTitle={project.name}
        projectId={projectId}
        projectKey={project.key}
        sprintKey={project.sprints?.length + 1}
      />

      {project.sprints.length > 0 ? (
        <SprintBoard
          sprints={project.sprints}
          projectId={projectId}
          orgId={project.organizationId}
        />
      ) : (
        <div>Create a Sprint from button above</div>
      )}
    </div>
  );
}