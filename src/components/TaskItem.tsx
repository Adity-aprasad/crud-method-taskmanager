
"use client";

import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-300",
        task.completed ? "bg-muted/50" : "bg-card"
      )}
    >
      <CardHeader>
        <div className="flex items-start gap-4">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={(checked) =>
              onToggleComplete(task.id, !!checked)
            }
            className="mt-1 h-5 w-5"
            aria-label={`Mark task "${task.title}" as ${
              task.completed ? "pending" : "complete"
            }`}
          />
          <div className="grid gap-1.5 flex-1">
            <CardTitle
              className={cn(
                "text-lg transition-all",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </CardTitle>
            {task.description && (
              <CardDescription
                className={cn(
                  "transition-all",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
        <time dateTime={task.createdAt}>
          Created: {format(new Date(task.createdAt), "PPp")}
        </time>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            aria-label={`Edit task "${task.title}"`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Delete task "${task.title}"`}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  task titled &quot;{task.title}&quot;.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(task.id)}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
