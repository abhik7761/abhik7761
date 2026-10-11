import { media } from '@/assets/media.config';
import { ResponsiveImage } from './ResponsiveImage';

type NavConn = { connection?: { saveData?: boolean } };
export function HeroVideo() {
  const saveData = (navigator as unknown as NavConn).connection?.saveData;
  const posterOnly =
    saveData ||
    window.matchMedia('(max-width: 767px)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <div className="absolute inset-0 -z-0 overflow-hidden bg-slate-900" aria-hidden>
      {posterOnly ? (
        <ResponsiveImage
          src={media.heroPoster}
          alt=""
          width={3840}
          height={2160}
          eager
          className="h-full w-full object-cover"
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={`${media.heroPoster}-1920.jpg`}
          className="h-full w-full object-cover"
        >
          <source src={media.heroVideoWebm} type="video/webm" />
          <source src={media.heroVideoMp4} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90" />
    </div>
  );
}
