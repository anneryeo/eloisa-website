import Image from "next/image";

export function AboutPortrait({
  mediaType = "image",
  imageUrl,
  fileUrl,
  hoverImageUrl,
  ratio = 0.82,
}: {
  mediaType?: "image" | "gif" | "video";
  imageUrl?: string;
  fileUrl?: string;
  hoverImageUrl?: string;
  ratio?: number;
}) {
  const hasMotionFile = mediaType !== "image" && Boolean(fileUrl);
  const hasPrimaryMedia = hasMotionFile || Boolean(imageUrl);

  if (!hasPrimaryMedia) {
    return (
      <div
        aria-hidden="true"
        className="w-full max-w-[340px] bg-placeholder"
        style={{ aspectRatio: ratio }}
      />
    );
  }

  const mediaClass = `h-full w-full object-cover transition-opacity duration-500 ease-gallery ${
    hoverImageUrl ? "group-hover:opacity-0" : ""
  }`;

  return (
    <figure
      className="group relative w-full max-w-[340px] overflow-hidden bg-placeholder transition-transform duration-300 ease-gallery hover:-rotate-1 hover:scale-[1.02]"
      style={{ aspectRatio: ratio }}
    >
      {mediaType === "video" && fileUrl ? (
        <video
          className={mediaClass}
          src={fileUrl}
          poster={imageUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : mediaType === "gif" && fileUrl ? (
        // A raw image preserves GIF animation; next/image would optimize it.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={mediaClass}
          src={fileUrl}
          alt="Portrait of Eloisa Claire"
        />
      ) : (
        <Image
          src={imageUrl!}
          alt="Portrait of Eloisa Claire"
          fill
          sizes="(max-width: 768px) 100vw, 340px"
          className={`object-cover ${mediaClass}`}
          priority
        />
      )}

      {hoverImageUrl && (
        <Image
          src={hoverImageUrl}
          alt="Alternate portrait of Eloisa Claire"
          fill
          sizes="(max-width: 768px) 100vw, 340px"
          className="object-cover opacity-0 transition-opacity duration-500 ease-gallery group-hover:opacity-100"
        />
      )}
    </figure>
  );
}
