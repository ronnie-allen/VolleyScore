"use client";

import { useRef } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScoreboardStore } from "@/store/scoreboard-store";
import { useToast } from "@/hooks/use-toast";
import { useHydrated } from "@/hooks/use-hydrated";
import { parseExportData, serializeExportData } from "@/lib/transfer";

export function DataTransfer() {
  const hydrated = useHydrated();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExport = () => {
    const { teams, scores } = useScoreboardStore.getState();
    const json = serializeExportData(teams, scores);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `volleytracker-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Export Complete", description: `Exported ${teams.length} teams and ${scores.length} score entries.` });
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-importing the same file
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parseExportData(JSON.parse(text));
      useScoreboardStore.getState().replaceAll(parsed);
      toast({
        title: "Import Complete",
        description: `Imported ${parsed.teams.length} teams and ${parsed.scores.length} score entries.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "The file is not a valid VolleyTracker export.";
      toast({ title: "Import Failed", description: message, variant: "destructive" });
    }
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
    </div>
  );
}
