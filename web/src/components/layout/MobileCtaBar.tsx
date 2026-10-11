import { Link } from 'react-router-dom';
import { brand } from '@/config/brand';
import { track } from '@/lib/track';

// Left-aligned buttons with right padding so the bottom-right chat bubble is never covered.
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-slate-200 bg-white p-2 pr-20 lg:hidden">
      <a
        href={`tel:${brand.supportPhoneTel}`}
        onClick={() => track('click_to_call')}
        className="btn-primary flex-1 !py-2.5"
      >
        Call Now
      </a>
      <Link to="/contact#quote" className="btn-cta flex-1 !py-2.5">
        Get a Quote
      </Link>
    </div>
  );
}
