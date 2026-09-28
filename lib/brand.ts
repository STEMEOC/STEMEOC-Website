/** Brand logos for the flagship programs, used on project cards and program heroes. */
const PROGRAM_LOGOS: { match: RegExp; src: string; monochrome?: boolean }[] = [
  { match: /festival/i, src: "/brand/festival-logo.png" },
  { match: /robotics|cro/i, src: "/brand/cro-logo.png", monochrome: true },
  { match: /icia/i, src: "/brand/icia-logo.png" },
  { match: /eco/i, src: "/brand/eco-stem-logo.png" },
  { match: /wro/i, src: "/brand/wro-logo.png" },
];

function findLogo(program: { slug: string; title: string }) {
  const key = `${program.slug} ${program.title}`;
  return PROGRAM_LOGOS.find((l) => l.match.test(key));
}

/** The program's brand logo, matched on its slug or title, or null if it has none. */
export function programLogo(program: { slug: string; title: string }): string | null {
  return findLogo(program)?.src ?? null;
}

/**
 * True when the logo is single-color navy, so it should be shown white
 * (`brightness-0 invert`) on a navy background. Multicolor logos keep their colors.
 */
export function programLogoIsMonochrome(program: { slug: string; title: string }): boolean {
  return findLogo(program)?.monochrome ?? false;
}

/**
 * Logos of schools that appear in competition results, from each school's
 * website or Facebook page. AUPP High School–Foxcroft Academy uses the AUPP
 * seal, as on its own site.
 */
const SCHOOL_LOGOS: { match: RegExp; src: string }[] = [
  { match: /aupp|american university of phnom penh/i, src: "/uploads/schools/aupp.png" },
  { match: /bluebird/i, src: "/uploads/schools/bluebird.png" },
  { match: /methodist/i, src: "/uploads/schools/methodist.png" },
  { match: /neeson cripps/i, src: "/uploads/schools/neeson-cripps.png" },
  { match: /jay pritzker/i, src: "/uploads/schools/jpa.png" },
  { match: /sovannaphumi/i, src: "/uploads/schools/sovannaphumi.png" },
  { match: /new ?gat ?e?way/i, src: "/uploads/schools/new-gateway.png" },
  { match: /northbridge/i, src: "/uploads/schools/northbridge.png" },
  { match: /preah sisowath/i, src: "/uploads/schools/preah-sisowath.png" },
  { match: /paragon/i, src: "/uploads/schools/paragon.png" },
  // The mark SEKSAAHUB uses; the same team runs Seksaa Tech Academy.
  { match: /seksaa/i, src: "/uploads/schools/seksaa.png" },
];

/** The school's logo, or null if we don't have one. */
export function schoolLogo(school: string | undefined): string | null {
  if (!school) return null;
  return SCHOOL_LOGOS.find((l) => l.match.test(school))?.src ?? null;
}
