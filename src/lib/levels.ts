// Proficiency levels shown in the main navigation, from beginner (M1) to advanced (M6).
export const LEVELS = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'] as const;

export type Level = (typeof LEVELS)[number];

// URL segment for a level, e.g. "M1" -> "m1".
export const levelSlug = (level: Level) => level.toLowerCase();
