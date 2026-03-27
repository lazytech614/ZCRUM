import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { priorities } from "@/constants/priorities"
import { Button } from "../ui/button"
import { X } from "lucide-react"
import { IssueType, UserType } from "@/types"

const BoardFilters = ({issues, onFilterChange}: {
  issues: IssueType[],
  onFilterChange: (filteredIssues: IssueType[]) => void
}) => {

  console.log(issues)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [selectedPriority, setSelectedPriority] = useState("")

  // Step 1: map assignees 
  const assigneesWithUndefined = issues.map((issue: IssueType) => issue.assignee);

  // Step 2: filter out undefined/null
  const definedAssignees: UserType[] = assigneesWithUndefined.filter(
    (assignee): assignee is UserType => assignee !== undefined && assignee !== null
  );

  // Step 3: deduplicate by id
  const assignees = definedAssignees.filter(
    (assignee, index, self) => self.findIndex((t) => t.id === assignee.id) === index
  );

  const isFiltered = !!searchTerm || !!selectedAssignees.length || !!selectedPriority

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedAssignees([])
    setSelectedPriority("")
  }

  useEffect(() => {
    const filteredIssues = issues.filter((issue: any) => {
      const matchesSearchTerm = issue.title.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesAssignees = selectedAssignees.length === 0 || selectedAssignees.includes(issue.assignee?.id)

      const matchesPriority = selectedPriority === "" || issue.priority === selectedPriority

      return matchesSearchTerm && matchesAssignees && matchesPriority
    })

    onFilterChange(filteredIssues)
  }, [searchTerm, selectedAssignees, selectedPriority, issues])

  const toggleAssignee = (assigneeId: string) => {
    if (selectedAssignees.includes(assigneeId)) {
      setSelectedAssignees(selectedAssignees.filter((id: string) => id !== assigneeId))
    } else {
      setSelectedAssignees([...selectedAssignees, assigneeId])
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row pr-2 gap-4 sm:gap-6 mt-6">
        <Input
          placeholder="Search Issues..."
          className="w-full sm:w-72"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="shrink-0">
          <div className="flex gap-2 flex-wrap">
            {assignees.map((assignee: any, i: number) => {
              const selected = selectedAssignees.includes(assignee.id)

              return <div 
                key={assignee.id} 
                className={`rounded-full ring-2 ${selected ? "ring-blue-600" : "ring-black"} ${i > 0 ? "-ml-6" : ""}`} 
                style={{
                  zIndex: i
                }}
                onClick={() => toggleAssignee(assignee.id)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={assignee.imageUrl} alt={assignee.name[0]} />
                  <AvatarFallback className="capitalize">
                    {assignee.name[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            })}
          </div>
        </div>
        <Select
            value={selectedPriority}
            onValueChange={setSelectedPriority}
          >
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
                <SelectItem value={priority}>{priority}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isFiltered && (
            <Button variant={"ghost"} onClick={clearFilters} className="flex items-center">
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
      </div>
    </div>
  )
}

export default BoardFilters