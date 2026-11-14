/** Supported investigation targets. Kept narrow so provider and collection code
 * can branch explicitly instead of guessing a platform from arbitrary URLs. */
export type SocialPlatform = "instagram" | "linkedin";

export interface NormalizedProfileInput {
  platform: SocialPlatform;
  username: string;
  profileUrl: string;
}

export class ProfileInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProfileInputError";
  }
}

const USERNAME_PATTERNS: Record<SocialPlatform, RegExp> = {
  instagram: /^[A-Za-z0-9._]{1,30}$/,
  linkedin: /^[A-Za-z0-9-]{3,100}$/,
};

const PROFILE_HOSTS: Record<SocialPlatform, string[]> = {
  instagram: ["instagram.com", "www.instagram.com"],
  linkedin: ["linkedin.com", "www.linkedin.com"],
};

/**
 * Accepts a platform username/identifier or a profile URL, then returns one
 * canonical HTTPS profile URL. This validates only the identifier format; it
 * does not claim that a profile exists or is publicly accessible.
 */
export function normalizeProfileInput(
  platform: SocialPlatform,
  input: string,
): NormalizedProfileInput {
  if (!(platform in USERNAME_PATTERNS)) {
    throw new ProfileInputError("Choose Instagram or LinkedIn.");
  }

  const value = input.trim();
  if (!value) throw new ProfileInputError("Enter a username or profile URL.");

  let username: string;
  if (/^https?:\/\//i.test(value)) {
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      throw new ProfileInputError("Enter a valid profile URL.");
    }

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new ProfileInputError("Only web profile URLs are supported.");
    }
    if (!PROFILE_HOSTS[platform].includes(url.hostname.toLowerCase())) {
      throw new ProfileInputError(`Enter a ${platform} profile URL.`);
    }

    const segments = url.pathname.split("/").filter(Boolean);
    if (platform === "linkedin") {
      if (segments.length !== 2 || segments[0].toLowerCase() !== "in") {
        throw new ProfileInputError("Use a public LinkedIn profile URL in the /in/username format.");
      }
      username = segments[1];
    } else {
      if (segments.length !== 1) {
        throw new ProfileInputError("Enter an Instagram profile URL, not a post or other page.");
      }
      username = segments[0];
    }
  } else {
    username = value.startsWith("@") ? value.slice(1) : value;
  }

  if (!USERNAME_PATTERNS[platform].test(username)) {
    throw new ProfileInputError(
      platform === "instagram"
        ? "Instagram usernames may contain letters, numbers, periods, and underscores (up to 30 characters)."
        : "LinkedIn public identifiers may contain letters, numbers, and hyphens (3–100 characters).",
    );
  }

  const profileUrl = platform === "instagram"
    ? `https://www.instagram.com/${username}/`
    : `https://www.linkedin.com/in/${username}/`;

  return { platform, username, profileUrl };
}
