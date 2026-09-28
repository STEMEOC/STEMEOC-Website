/**
 * Hidden songs on team profiles, keyed by profile slug. On that profile the
 * corner "back" button morphs into a small player and "About me" turns into
 * lyrics that follow the song.
 */
export type LyricLine = {
  /** Second in the song where the line starts. */
  t: number;
  text: string;
};

export type EasterEgg = {
  videoId: string;
  title: string;
  artist: string;
  /** In order of `t`. Leave empty to show a "now playing" card instead. */
  lyrics: LyricLine[];
};

export const EASTER_EGGS: Record<string, EasterEgg> = {
  "te-henglay": {
    videoId: "UMtEAAZhgrM",
    title: "Let Me Go",
    artist: "Daniel Caesar",
    // One entry per line, e.g. { t: 14.2, text: "First line of the song" }.
    // Play the song and note the second each line starts (the player shows the time).
    lyrics: [],
  },
};
