"use client";

import dynamic from "next/dynamic";

// The particles canvas and custom cursor render nothing meaningful until their
// client JS runs, so we code-split them and skip SSR — keeps them out of the
// initial bundle/HTML with no visual change (they only appear after mount).
const Particles = dynamic(() => import("./Particles").then((m) => m.Particles), {
  ssr: false,
});
const Cursor = dynamic(() => import("./Cursor").then((m) => m.Cursor), {
  ssr: false,
});

export function DeferredFX() {
  return (
    <>
      <Particles />
      <Cursor />
    </>
  );
}
