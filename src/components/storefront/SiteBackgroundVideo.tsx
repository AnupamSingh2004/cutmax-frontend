export function SiteBackgroundVideo({ src }: { src?: string }) {
  return (
    <div className="site-background-video" aria-hidden="true">
      <video autoPlay muted loop playsInline preload="metadata">
        <source src={src || "/videos/cutmax-industrial-background.mp4"} type="video/mp4" />
      </video>
    </div>
  );
}
