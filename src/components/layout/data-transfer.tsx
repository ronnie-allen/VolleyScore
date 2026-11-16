"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { useScoreboardStore } from "@/store/scoreboard-store";
import { useToast } from "@/hooks/use-toast";
import { useHydrated } from "@/hooks/use-hydrated";
import { parseExportData, serializeExportData } from "@/lib/transfer";
import type { ImportResult } from "@/lib/transfer";

const MAX_IMPORT_BYTES = 5 * 1024 * 1024; // 5 MB

function downloadJson(filename: string, json: string) {
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function DataTransfer() {
  const hydrated = useHydrated();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [pendingImport, setPendingImport] = useState<ImportResult | null>(null);

  const handleExport = () => {
    const { teams, scores } = useScoreboardStore.getState();
    downloadJson(
      `volleytracker-export-${new Date().toISOString().slice(0, 10)}.json`,
      serializeExportData(teams, scores)
    );
    toast({ title: "Export Complete", description: `Exported ${teams.length} teams and ${scores.length} score entries.` });
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-importing the same file
    if (!file) return;

    if (file.size > MAX_IMPORT_BYTES) {
      toast({ title: "Import Failed", description: "The file is larger than 5 MB and cannot be imported.", variant: "destructive" });
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseExportData(JSON.parse(text));
      setPendingImport(parsed);
    } catch (error) {
      const message = error instanceof Error ? error.message : "The file is not a valid VolleyTracker export.";
      toast({ title: "Import Failed", description: message, variant: "destructive" });
    }
  };

  const confirmImport = () => {
    if (!pendingImport) return;
    // Back up current data before overwriting it.
    const { teams, scores } = useScoreboardStore.getState();
    downloadJson(
      `volleytracker-backup-${new Date().toISOString().slice(0, 10)}.json`,
      serializeExportData(teams, scores)
    );
    useScoreboardStore.getState().replaceAll(pendingImport);
    toast({
      title: "Import Complete",
      description: `Imported ${pendingImport.teams.length} teams and ${pendingImport.scores.length} score entries. A backup of your previous data was downloaded.`,
    });
    setPendingImport(null);
  };

  return (
    <div className="flex items-center gap-1">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        aria-hidden="true"
        onChange={handleImportFile}
      />
      <Button variant="ghost" size="sm" onClick={handleExport} disabled={!hydrated} className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
        <Download className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Export</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} disabled={!hydrated} className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
        <Upload className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Import</span>
      </Button>

      <AlertDialog open={pendingImport !== null} onOpenChange={(open) => { if (!open) setPendingImport(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace all current data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace everything currently in VolleyTracker with{" "}
              {pendingImport?.teams.length ?? 0} teams and {pendingImport?.scores.length ?? 0} score entries
              from the import file. Your current data will be downloaded as a backup JSON file first, then overwritten.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport}>Import &amp; Replace</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
