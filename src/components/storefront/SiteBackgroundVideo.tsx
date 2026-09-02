export function SiteBackgroundVideo({ src }: { src?: string }) {
  return (
    <div className="site-background-video" aria-hidden="true">
      <video autoPlay muted loop playsInline preload="metadata">
        <source
          src={src || "https://464.objects.excloud.dev/public/cutmax-images/videos/cutmax-industrial-background.mp4"}
          type="video/mp4"
        />
      </video>
    </div>
  );
}
