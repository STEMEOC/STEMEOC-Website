/**
 * Hidden songs on team profiles, keyed by profile slug. On that profile the
 * corner "back" button morphs into a small player and "About me" turns into
 * the song's lyrics.
 */
export type EasterEgg = {
  /** Path under /public. */
  audioSrc: string;
  title: string;
  artist: string;
  /** From the song's Genius embed code (data-song-id). */
  geniusSongId: number;
  geniusUrl: string;
  /** A second photo, revealed in a circle around the cursor when hovering the portrait. */
  revealPhoto?: string;
};

export const EASTER_EGGS: Record<string, EasterEgg> = {
  "te-henglay": {
    audioSrc: "/audio/let-me-go.mp3",
    title: "Let Me Go",
    artist: "Daniel Caesar",
    geniusSongId: 8802324,
    geniusUrl: "https://genius.com/Daniel-caesar-let-me-go-lyrics",
    revealPhoto: "/uploads/team/te-henglay-reveal.jpg",
  },
};
