
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LogOut, PlusCircle, Rocket } from "lucide-react";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Task } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { TaskForm } from "@/components/TaskForm";
import { TaskItem } from "@/components/TaskItem";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isMounted, setIsMounted] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  
  const [filter, setFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/");
    } else {
      setUsername(storedUsername);
    }
    setIsMounted(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    router.push("/");
  };

  const handleAddTask = (data: { title: string; description?: string }) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description || "",
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    setIsFormOpen(false);
    toast({ title: "Success", description: "Task added successfully." });
  };

  const handleEditTask = (data: { title: string; description?: string }) => {
    if (!taskToEdit) return;
    setTasks(
      tasks.map((task) =>
        task.id === taskToEdit.id ? { ...task, ...data } : task
      )
    );
    setIsFormOpen(false);
    setTaskToEdit(null);
    toast({ title: "Success", description: "Task updated successfully." });
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, completed } : task))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast({
      title: "Success",
      description: "Task deleted successfully.",
      variant: "destructive",
    });
  };

  const handleOpenEditForm = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };
  
  const handleOpenAddForm = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  }

  const filteredTasks = useMemo(() => {
    if (filter === "completed") {
      return tasks.filter((task) => task.completed);
    }
    if (filter === "pending") {
      return tasks.filter((task) => !task.completed);
    }
    return tasks;
  }, [tasks, filter]);

  const taskCounts = useMemo(() => {
    const pending = tasks.filter(task => !task.completed).length;
    return {
        all: tasks.length,
        pending,
        completed: tasks.length - pending,
    }
  }, [tasks]);

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Rocket className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <div className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-bold">TaskMaster Lite</span>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline">
              Welcome, {username}!
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
                <p className="text-muted-foreground">Manage and organize your daily tasks.</p>
            </div>
            <Button onClick={handleOpenAddForm} className="bg-accent hover:bg-accent/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>

          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All ({taskCounts.all})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({taskCounts.pending})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({taskCounts.completed})</TabsTrigger>
            </TabsList>
            <TabsContent value={filter} className="mt-4">
              <div className="space-y-4">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleOpenEditForm}
                      onDelete={handleDeleteTask}
                    />
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-16">
                    <p className="text-lg font-medium">No tasks found.</p>
                    <p>
                      {filter === "all"
                        ? "Click 'Add Task' to get started!"
                        : `You have no ${filter} tasks.`}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <TaskForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={taskToEdit ? handleEditTask : handleAddTask}
        taskToEdit={taskToEdit}
      />
    </>
  );
}
