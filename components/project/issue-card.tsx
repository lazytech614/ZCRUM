"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import UserAvatar from "../global/user-avatar";
import IssueDetailsDialog from "./issue-details-dialog";
import { statuses } from "@/constants/statuses";
import { IssueType } from "@/types";

const priorityColor = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-300",
  HIGH: "border-orange-400",
  URGENT: "border-red-400",
};

export default function IssueCard({
  issue,
  showStatus = false,
  onDelete = () => {},
  onUpdate = () => {},
}: {
  issue: IssueType;
  showStatus?: boolean;
  onDelete?: (...args: any[]) => void;
  onUpdate?: (...args: any[]) => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const onDeleteHandler = (...params: any) => {
    router.refresh();
    onDelete(...params);
  };

  const onUpdateHandler = (...params: any) => {
    router.refresh();
    onUpdate(...params);
  };

  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  const statusObj = statuses.find(s => s.key === issue.status)

  return (
    <>
      <Card
        className={`border-t-2 ${priorityColor[issue.priority as keyof typeof priorityColor]} rounded-lg cursor-pointer hover:shadow-md transition-shadow`}
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader>
          <CardTitle>{issue.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-2 -mt-3">
          {showStatus && <Badge>{statusObj?.name}</Badge>}
          <Badge variant="outline" className="-ml-1">
            {issue.priority}
          </Badge>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-3">
          <UserAvatar user={issue.assignee} />

          <div className="text-xs text-gray-400 w-full">Created {created}</div>
        </CardFooter>
      </Card>

      {isDialogOpen && (
        <IssueDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          issue={issue}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          borderCol={priorityColor[issue.priority as keyof typeof priorityColor]}
        />
      )}
    </>
  );
}