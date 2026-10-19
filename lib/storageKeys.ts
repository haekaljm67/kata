// Names that Kata's data is saved under in the browser (localStorage).
// Kept in this tiny file so both server and browser code can use them.
// The ".v1" lets us change the shape of the data later without mixing
// it up with old saves.

// Learning progress: words, streak, daily goal.
export const PROGRESS_KEY = "kata.progress.v1";

// Settings. Stored under the name earlier versions used for
// preferences, so the Practice language picked before is kept.
export const SETTINGS_KEY = "kata.preferences.v1";

// Set when the visitor taps "Start learning" on the welcome page.
export const WELCOMED_KEY = "kata.welcomed.v1";
