export function SiteBackgroundVideo() {
  return (
    <div className="site-background-video" aria-hidden="true">
      <video autoPlay muted loop playsInline preload="metadata">
        <source src="/videos/cutmax-industrial-background.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
