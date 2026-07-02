// Tracks whether the intro loader has already played for THIS page load.
//
// A module-level value is initialized once per full page load and preserved
// across client-side (SPA) route changes, but reset on every real reload. So:
//   - Reload / direct load of the home page  → loader plays.
//   - Navigating to home from another page    → loader is skipped.
export const introState = { shown: false };
