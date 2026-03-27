import { getOrganization } from "@/actions/organizations"
import OrgSwitcher from "@/components/organization/org-switcher"
import ProjectList from "@/components/organization/project-list"
import UserIssues from "@/components/organization/user-issues"
import { auth } from "@clerk/nextjs/server"

type Props = {
  params: Promise<{orgId: string}>
}

const OrganisationPage = async({params}: Props) => {

  const {orgId} = await params
  const {userId} = await auth()

  const organization = await getOrganization(orgId)

  if(!organization) {
    return (
      <div>Organization not found</div>
    )
  }

  if (!userId) {
    return <div>Please sign in</div>
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
        <h1 className="text-5xl font-bold gradient-title pb-2">
          {organization.name}&rsquo;s Projects
        </h1>

        <OrgSwitcher />
      </div>
      <div className="mb-4">
        <ProjectList orgId={organization.id} />
      </div>
      <div className="mt-8">
        <UserIssues userId={userId} />
      </div>
    </div>
  )
}

export default OrganisationPage