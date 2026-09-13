import { motion } from "framer-motion";
import { ImagePlus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED.includes(file.type)) return "Please choose a JPG, PNG or WebP image.";
  if (file.size > MAX_BYTES) return "That image is over 10 MB. Please pick a smaller one.";
  if (file.size < 1024) return "That file looks empty or damaged.";
  return null;
}

export function Dropzone({
  onFile,
  onError,
}: {
  onFile: (file: File) => void;
  onError: (message: string) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      onError(error);
      return;
    }
    onFile(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "relative rounded-3xl p-1 transition-colors duration-300",
        dragging && "[background-image:var(--gradient-accent)]",
      )}
    >
      <motion.button
        type="button"
        onClick={() => inputRef.current?.click()}
        whileTap={{ scale: 0.985 }}
        className={cn(
          "glass flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl px-6 py-14 text-center transition-colors",
          dragging ? "border-transparent bg-secondary" : "border-2 border-dashed",
          !dragging && "breathe",
        )}
        aria-label="Upload a cricketer's photo"
      >
        <motion.span
          animate={dragging ? { y: [-4, 2, -4] } : { y: 0 }}
          transition={{ repeat: dragging ? Infinity : 0, duration: 0.8 }}
          className="flex size-16 items-center justify-center rounded-2xl border border-border text-accent"
        >
          {dragging ? <Upload className="size-7" /> : <ImagePlus className="size-7" />}
        </motion.span>
        <span className="font-display text-lg font-bold">
          {dragging ? "Drop the photo here" : "Drag a photo in"}
        </span>
        <span className="text-sm text-muted-foreground">
          JPG, PNG or WebP · up to 10 MB · one face works best
        </span>
        <span className="text-sm text-muted-foreground underline decoration-dotted underline-offset-4">
          or tap to browse your photos
        </span>
      </motion.button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture={undefined}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
