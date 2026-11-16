"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Use Textarea for members
import { useScoreboardStore } from "@/store/scoreboard-store";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().trim().min(2, {
    message: "Team name must be at least 2 characters.",
  }).max(100),
  members: z.string().max(2000).optional(),
});

export function AddTeamForm() {
  const addTeam = useScoreboardStore((state) => state.addTeam);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      members: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const memberList = values.members
      ? values.members.split(/\r?\n+/).map((m) => m.trim()).filter(Boolean)
      : [];
    const newTeam = addTeam(values.name, memberList);
    toast({
      title: "Team Added",
      description: `Team "${newTeam.name}" has been successfully added.`,
    });
    form.reset(); // Reset form after submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Spike Squad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="members"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Members (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="One member name per line (commas inside names are preserved)"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Team
        </Button>
      </form>
    </Form>
  );
}