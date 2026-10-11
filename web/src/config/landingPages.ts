export interface LandingPage {
  slug: string;
  headline: string;
  subheadline: string;
  serviceSlug: string;
  benefits: string[];
  faq: { q: string; a: string }[];
}
export const landingPages: LandingPage[] = [
  {
    slug: 'fishfinder-installation',
    headline: 'Fishfinder & Chartplotter Installation Near You',
    subheadline: 'Authorized technicians. Fully tested before we leave.',
    serviceSlug: 'fishfinder-installation',
    benefits: [
      'Certified, insured technicians',
      'Clean wiring & transducer mounting',
      'Satisfaction guarantee',
    ],
    faq: [{ q: 'How long does installation take?', a: 'Most installs take 2 to 4 hours.' }],
  },
  {
    slug: 'appliance-repair',
    headline: 'Appliance Repair, Scheduled Online',
    subheadline: 'Same-week appointments in your area.',
    serviceSlug: 'appliance-repair',
    benefits: ['Upfront pricing', 'Background-checked techs', 'Warranty on repairs'],
    faq: [{ q: 'Do you bring parts?', a: 'Common parts are carried on the van.' }],
  },
];
