export interface SocialVideoEmbed {
  platform: "YouTube" | "Instagram" | "TikTok";
  src: string;
}

/** Convert an editor-provided social URL into an allowlisted embed URL. */
export function getSocialVideoEmbed(
  value?: string,
  options: { autoplay?: boolean } = {},
): SocialVideoEmbed | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be" || host === "youtube.com" || host.endsWith(".youtube.com")) {
      const id =
        host === "youtu.be"
          ? url.pathname.split("/").filter(Boolean)[0]
          : url.searchParams.get("v") ??
            url.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/)?.[1];
      if (!id || !/^[\w-]{6,}$/.test(id)) return null;
      return {
        platform: "YouTube",
        src: `https://www.youtube-nocookie.com/embed/${id}?rel=0${
          options.autoplay ? `&autoplay=1&mute=1&loop=1&playlist=${id}` : ""
        }`,
      };
    }

    if (host === "instagram.com" || host.endsWith(".instagram.com")) {
      const match = url.pathname.match(/^\/(?:p|reel|reels|tv)\/([^/]+)/);
      if (!match) return null;
      return {
        platform: "Instagram",
        src: `https://www.instagram.com/p/${match[1]}/embed/`,
      };
    }

    if (host === "tiktok.com" || host.endsWith(".tiktok.com")) {
      const id = url.pathname.match(/\/video\/(\d+)/)?.[1];
      if (!id) return null;
      return {
        platform: "TikTok",
        src: `https://www.tiktok.com/player/v1/${id}?controls=${options.autoplay ? 0 : 1}&loop=1${
          options.autoplay ? "&autoplay=1&mute=1" : ""
        }`,
      };
    }
  } catch {
    return null;
  }

  return null;
}
