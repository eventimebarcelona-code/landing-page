/**
 * Fixed full-viewport film grain / paper texture rendered with an SVG
 * fractalNoise filter, desaturated to greyscale and laid over the whole page
 * at a low opacity. pointer-events: none so it never blocks interaction.
 */
export function GrainOverlay() {
  return (
    <svg
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1000,
        pointerEvents: "none",
        opacity: 0.08,
      }}
    >
      <filter id="paperGrain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves={3}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paperGrain)" />
    </svg>
  );
}
