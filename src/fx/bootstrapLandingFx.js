/**
 * @deprecated Retired — core FX are mounted via useLandingEffects (dynamic import + lifecycle).
 * Kept as a no-op so any stray import does not inject SCRIPT_CHAIN.
 */
export async function bootstrapLandingFx() {
  console.warn(
    "[landing-fx] bootstrapLandingFx is retired; use useLandingEffects instead"
  );
}

export function teardownLandingFx() {
  /* no-op */
}
