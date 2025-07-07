
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    if (localStorage.getItem("username")) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem("username", username.trim());
      router.push("/dashboard");
    }
  };

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-8 left-8 flex items-center gap-2 text-xl font-bold text-primary">
        <Rocket className="h-6 w-6" />
        <span>TaskMaster Lite</span>
      </div>
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
          <CardDescription>
            Enter your username to access your tasks.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="e.g. jane_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Enter Dashboard
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
