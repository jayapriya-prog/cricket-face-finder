import logo from "@/assets/cricket-face-logo.png.asset.json";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="Indian Cricket Player Face Recognition System badge"
      className={cn("h-12 w-12 rounded-full object-cover", className)}
      style={{ objectPosition: "center" }}
    />
  );
}
