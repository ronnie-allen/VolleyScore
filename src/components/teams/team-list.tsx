"use client";

import { useScoreboardStore } from "@/store/scoreboard-store";
import { Button } from "@/components/ui/button";
import { Trash2, Users } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TeamList() {
  const teams = useScoreboardStore((state) => state.teams);
  const deleteTeam = useScoreboardStore((state) => state.deleteTeam);
  const { toast } = useToast();

  const handleDelete = (teamId: string, teamName: string) => {
    deleteTeam(teamId);
    toast({
      title: "Team Deleted",
      description: `Team "${teamName}" has been removed.`,
      variant: "destructive",
    });
  };

  if (!teams || teams.length === 0) {
    return <p className="text-muted-foreground text-center">No teams added yet.</p>;
  }

  return (
    <ScrollArea className="h-[calc(100vh-400px)] pr-4"> {/* Adjust height as needed */}
      <ul className="space-y-3">
        {teams.map((team) => (
          <li key={team.id} className="flex items-center justify-between p-3 bg-secondary rounded-md shadow-sm">
            <div className="flex items-center gap-3">
               <Users className="h-5 w-5 text-secondary-foreground" />
               <span className="font-medium text-secondary-foreground">{team.name}</span>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete team {team.name}</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the team "{team.name}" and all associated score data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(team.id, team.name)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}