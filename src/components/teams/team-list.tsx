"use client";

import { useState } from "react";
import { useScoreboardStore } from "@/store/scoreboard-store";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Users } from "lucide-react";
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
import { useHydrated } from "@/hooks/use-hydrated";
import { EditTeamDialog } from "@/components/teams/edit-team-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Team } from "@/types";

export function TeamList() {
  const hydrated = useHydrated();
  const teams = useScoreboardStore((state) => state.teams);
  const deleteTeam = useScoreboardStore((state) => state.deleteTeam);
  const { toast } = useToast();
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const handleDelete = (teamId: string, teamName: string) => {
    deleteTeam(teamId);
    toast({
      title: "Team Deleted",
      description: `Team "${teamName}" has been removed.`,
      variant: "destructive",
    });
  };

  if (!hydrated) {
    return <p className="text-muted-foreground text-center">Loading teams…</p>;
  }

  if (!teams || teams.length === 0) {
    return (
      <p className="text-muted-foreground text-center italic">
        No teams yet — sign the first roster above and hit the court.
      </p>
    );
  }

  return (
    <>
    <ScrollArea className="h-[calc(100vh-430px)] min-h-48 pr-3">
      <ul className="space-y-2">
        {teams.map((team, index) => (
          <li
            key={team.id}
            className="group flex items-center justify-between gap-2 rounded-lg border border-border bg-secondary/40 p-3 transition-colors hover:border-primary/40 hover:bg-secondary"
          >
            <div className="flex items-center gap-3 min-w-0">
               <span className="num text-xs text-muted-foreground/70 w-5">{String(index + 1).padStart(2, '0')}</span>
               <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                 <Users className="h-5 w-5" />
               </span>
               <div className="min-w-0">
                 <span className="section-title not-italic block truncate text-base text-foreground">{team.name}</span>
                 {team.members.length > 0 && (
                   <span className="text-[11px] uppercase tracking-wider text-muted-foreground block truncate">
                     {team.members.join(" · ")}
                   </span>
                 )}
               </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                onClick={() => setEditingTeam(team)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit team {team.name}</span>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete team {team.name}</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cut {team.name} from the roster?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the team &quot;{team.name}&quot; and all associated score data.
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
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
    <EditTeamDialog
      team={editingTeam}
      open={editingTeam !== null}
      onOpenChange={(open) => { if (!open) setEditingTeam(null); }}
    />
    </>
  );
}
