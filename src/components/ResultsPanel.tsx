import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { ActionButton } from "@/components/ActionButton";
import { ConfidenceRing } from "@/components/ConfidenceRing";
import { CONFIDENCE_THRESHOLD, type MatchCandidate } from "@/lib/matching";

function Burst() {
  const pieces = Array.from({ length: 18 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((_, i) => (
        <motion.span
          key={i}
          className="absolute top-1/3 left-1/2 size-1.5 rounded-full [background-image:var(--gradient-accent)]"
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{
            opacity: 0,
            x: Math.cos((i / pieces.length) * Math.PI * 2) * 180,
            y: Math.sin((i / pieces.length) * Math.PI * 2) * 140,
            scale: 0.4,
          }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function ResultsPanel({
  imageUrl,
  candidates,
  onReset,
}: {
  imageUrl: string;
  candidates: MatchCandidate[];
  onReset: () => void;
}) {
  const best = candidates[0];
  const matched = !!best && best.confidence >= CONFIDENCE_THRESHOLD;
  // Only offer alternatives when the top match is not a confident one — a
  // certain result shouldn't be muddied by near-miss suggestions.
  const alternates =
    matched && best.confidence > 90 ? [] : candidates.slice(matched ? 1 : 0, matched ? 4 : 3);

  return (
    <div className="space-y-6">
      <div className="relative">
        {matched && best.confidence > 90 && <Burst />}
        <div className="glass sheen grid gap-6 rounded-3xl p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="flex min-w-0 items-center gap-5">
            <motion.img
              layoutId="subject-photo"
              src={imageUrl}
              alt="The photo you uploaded"
              className="size-24 shrink-0 rounded-2xl object-cover sm:size-32"
            />
            <div className="min-w-0">
              {matched ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 16 }}
                >
                  <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    Identified as
                  </p>
                  <h2 className="font-display truncate text-3xl font-bold sm:text-4xl">
                    {best.player.name}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {best.player.role && (
                      <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">
                        {best.player.role}
                      </span>
                    )}
                    {best.player.era && (
                      <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">
                        {best.player.era}
                      </span>
                    )}
                    {best.player.years && (
                      <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">
                        {best.player.years}
                      </span>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div>
                  <SearchX className="mb-2 size-8 text-muted-foreground" />
                  <h2 className="font-display text-2xl font-bold sm:text-3xl">
                    We couldn't find a confident match
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    The closest players are below, but the similarity is under our{" "}
                    {CONFIDENCE_THRESHOLD}% threshold. A clear, front-facing photo usually helps.
                  </p>
                </div>
              )}
            </div>
          </div>
          {matched && <ConfidenceRing value={best.confidence} />}
        </div>
      </div>

      {alternates.length > 0 && (
        <section aria-label="Other possible matches">
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground">
            {matched ? "Could also be…" : "Closest players"}
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {alternates.map((candidate, index) => (
              <motion.article
                key={candidate.player.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass sheen w-44 shrink-0 rounded-2xl p-4 text-center"
              >
                {candidate.player.photoUrl ? (
                  <img
                    src={candidate.player.photoUrl}
                    alt={candidate.player.name}
                    loading="lazy"
                    className="mx-auto size-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="shimmer mx-auto size-20 rounded-full" />
                )}
                <p className="mt-3 truncate text-sm font-semibold">{candidate.player.name}</p>
                <ConfidenceRing
                  value={candidate.confidence}
                  size={64}
                  showLabel={false}
                  className="mt-2"
                />
              </motion.article>
            ))}
          </div>
        </section>
      )}

      <div className="flex justify-center">
        <ActionButton variant="accent" size="lg" onClick={onReset}>
          Try another image
        </ActionButton>
      </div>
    </div>
  );
}
