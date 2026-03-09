import React from "react";
import clsx from "clsx";

export const BackgroundBeams = React.memo(({ className }: { className?: string }) => {
  return (
    <div className={clsx("absolute inset-0 pointer-events-none overflow-hidden", className)}>

      {/* Grid lines — horizontal + vertical */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 51, 0, 0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 51, 0, 0.18) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Radial fade — keeps edges dark so it blends with the rest of the page */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 90% 70% at 50% 50%, transparent 20%, #050505 75%)',
        }}
      />

      {/* Subtle orange glow at center-bottom to add warmth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(255, 51, 0, 0.08) 0%, transparent 70%)',
        }}
      />

    </div>
  );
});

BackgroundBeams.displayName = "BackgroundGrid";
