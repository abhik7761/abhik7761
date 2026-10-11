const WIDTHS = [640, 1280, 1920, 2560, 3840];
interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  eager?: boolean;
  className?: string;
}

/** `src` is an extension-less base path; files named `<base>-<w>.avif|webp|jpg` are expected (build pipeline creates them). */
export function ResponsiveImage({ src, alt, width, height, sizes = '100vw', eager, className }: Props) {
  const set = (ext: string) => WIDTHS.map((w) => `${src}-${w}.${ext} ${w}w`).join(', ');
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`${src}-1280.jpg`}
        srcSet={set('jpg')}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
        onError={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg,#0B3D91,#00B4D8)';
        }}
      />
    </picture>
  );
}
