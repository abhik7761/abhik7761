import { useLocation } from 'react-router-dom';
import { Seo } from '@/components/ui/Seo';
const titles: Record<string, string> = {
  privacy: 'Privacy Policy (incl. CCPA/CPRA)',
  terms: 'Terms of Service',
  cookies: 'Cookie Policy',
  ccpa: 'Do Not Sell or Share My Personal Information',
  refunds: 'Refund and Cancellation Policy',
  warranty: 'Service Warranty',
  accessibility: 'Accessibility Statement',
};
export default function Legal() {
  const key = useLocation().pathname.slice(1);
  const t = titles[key] ?? 'Legal';
  return (
    <div className="container-x section max-w-3xl">
      <Seo title={t} />
      <h1 className="text-4xl font-bold">{t}</h1>
      {/* TODO: legal review — template text only */}
      <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
        TODO: legal review. This page is a template and must be reviewed by a lawyer before launch.
      </p>
      <p className="mt-4 text-slate-700">Template content for {t} goes here.</p>
    </div>
  );
}
