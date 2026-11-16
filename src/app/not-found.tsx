import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center bg-background text-foreground">
      <h2 className="text-2xl font-bold">Page not found</h2>
      <p className="text-muted-foreground max-w-md">
        The page you are looking for does not exist.
      </p>
      <Button asChild>
        <Link href="/">Back to Scoreboard</Link>
      </Button>
    </div>
  );
}
