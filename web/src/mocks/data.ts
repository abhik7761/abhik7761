import type { Booking, Brand, Category, Lead, Product, Review, Service } from '@/types';

export const brands: Brand[] = ['Garmin', 'Lowrance', 'Samsung', 'LG', 'Whirlpool', 'Bosch'].map(
  (name, i) => ({
    id: `b${i + 1}`,
    slug: name.toLowerCase(),
    name,
    logo: `/brands/${name.toLowerCase()}.svg`,
    order: i,
    placeholder: true,
  }),
);

export const categories: Category[] = [
  { id: 'c1', slug: 'installation', name: 'Installation', type: 'service', order: 1 },
  { id: 'c2', slug: 'repair', name: 'Repair', type: 'service', order: 2 },
  { id: 'c3', slug: 'setup', name: 'Setup', type: 'service', order: 3 },
  { id: 'c4', slug: 'marine-electronics', name: 'Marine Electronics', type: 'service', order: 4 },
  { id: 'c5', slug: 'appliances', name: 'Appliances', type: 'service', order: 5 },
  { id: 'p1', slug: 'refrigerators', name: 'Refrigerators', type: 'product', order: 1 },
  { id: 'p2', slug: 'washers-dryers', name: 'Washers & Dryers', type: 'product', order: 2 },
  { id: 'p3', slug: 'kitchen', name: 'Kitchen', type: 'product', order: 3 },
];

const svc = (
  n: number,
  name: string,
  categoryId: string,
  priceFrom: number,
  durationMin: number,
  brandIds: string[],
): Service => ({
  id: `s${n}`,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  name,
  categoryId,
  shortDesc: `Professional ${name.toLowerCase()} by certified technicians.`,
  description: `Our certified technicians provide ${name.toLowerCase()} at your location. Includes testing and a walkthrough.`,
  images: [`/media/service-${n}`],
  priceFrom,
  depositType: n % 3 === 0 ? 'percent' : n % 3 === 1 ? 'fixed' : 'none',
  depositValue: n % 3 === 0 ? 25 : 5000,
  durationMin,
  brandIds,
  active: true,
});
export const services: Service[] = [
  svc(1, 'Fishfinder Installation', 'c4', 14900, 180, ['b1', 'b2']),
  svc(2, 'Chartplotter Setup', 'c4', 12900, 120, ['b1', 'b2']),
  svc(3, 'GPS Troubleshooting', 'c4', 9900, 90, ['b1', 'b2']),
  svc(4, 'Transducer Mounting', 'c4', 17900, 150, ['b1', 'b2']),
  svc(5, 'Refrigerator Installation', 'c1', 9900, 90, ['b3', 'b4', 'b5']),
  svc(6, 'Washer & Dryer Installation', 'c1', 11900, 120, ['b3', 'b4', 'b5']),
  svc(7, 'Dishwasher Installation', 'c1', 12900, 120, ['b6', 'b5']),
  svc(8, 'Appliance Repair', 'c2', 8900, 90, ['b3', 'b4', 'b5', 'b6']),
  svc(9, 'Washer Repair', 'c2', 8900, 90, ['b3', 'b4']),
  svc(10, 'TV Wall Mounting', 'c3', 9900, 90, ['b3', 'b4']),
  svc(11, 'Smart Home Setup', 'c3', 14900, 120, ['b3', 'b4']),
  svc(12, 'Oven & Range Installation', 'c5', 13900, 120, ['b5', 'b6']),
];

const prodNames = [
  'French Door Refrigerator',
  'Top-Load Washer',
  'Front-Load Dryer',
  'Dishwasher',
  'Gas Range',
  'Microwave',
];
export const products: Product[] = Array.from({ length: 24 }, (_, i) => {
  const name = `${prodNames[i % 6]} ${['Pro', 'Plus', 'Max', 'Lite'][Math.floor(i / 6)]}`;
  return {
    id: `pr${i + 1}`,
    slug: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    sku: `SKU-${1000 + i}`,
    name,
    brandId: brands[2 + (i % 4)].id,
    categoryId: ['p1', 'p2', 'p2', 'p3', 'p3', 'p3'][i % 6],
    price: 39900 + i * 12500,
    compareAtPrice: i % 3 === 0 ? 39900 + i * 12500 + 15000 : undefined,
    stock: i % 7 === 0 ? 0 : 3 + (i % 9),
    images: [`/media/product-${i + 1}`],
    specs: { Capacity: `${10 + i} cu ft`, Color: 'Stainless', Warranty: '1 year' },
    installServiceId: ['s5', 's6', 's6', 's7', 's12', 's10'][i % 6],
    rating: 3.5 + ((i * 7) % 15) / 10,
    reviewCount: 4 + i,
    active: true,
    weightLb: 60 + i * 5,
  };
});

export const reviews: Review[] = [
  {
    id: 'r1',
    author: 'Placeholder Customer A',
    rating: 5,
    body: 'Placeholder review text — replace with real reviews.',
    placeholder: true,
  },
  {
    id: 'r2',
    author: 'Placeholder Customer B',
    rating: 5,
    body: 'Placeholder review text — replace with real reviews.',
    placeholder: true,
  },
  {
    id: 'r3',
    author: 'Placeholder Customer C',
    rating: 4,
    body: 'Placeholder review text — replace with real reviews.',
    placeholder: true,
  },
];

const names = ['Alex Morgan', 'Jamie Lee', 'Chris Taylor', 'Sam Rivera', 'Pat Johnson'];
const consent = { text: 'seed', at: new Date().toISOString(), url: '/seed' };
export const leads: Lead[] = Array.from({ length: 30 }, (_, i) => ({
  id: `l${i + 1}`,
  type: (['quote', 'callback', 'booking_abandoned', 'out_of_area', 'chat'] as const)[i % 5],
  name: names[i % 5],
  email: `lead${i}@example.com`,
  phone: '(555) 010-' + String(1000 + i).slice(-4),
  serviceId: `s${(i % 12) + 1}`,
  zip: ['33101', '10001', '60601', '98101', '73301'][i % 5],
  status: (['New', 'Contacted', 'Quoted', 'Booked', 'Lost'] as const)[i % 5],
  tcpaConsent: consent,
  attribution: {
    utmSource: ['google', 'facebook', 'direct'][i % 3],
    utmMedium: i % 3 === 2 ? undefined : 'cpc',
    utmCampaign: 'spring-installs',
    landingPage: '/lp/fishfinder-installation',
    referrer: '',
    firstSeenAt: new Date().toISOString(),
  },
  createdAt: new Date(Date.now() - i * 36e5 * 7).toISOString(),
}));

export const bookings: Booking[] = Array.from({ length: 20 }, (_, i) => ({
  id: `bk${i + 1}`,
  serviceId: `s${(i % 12) + 1}`,
  customerName: names[i % 5],
  email: `cust${i}@example.com`,
  phone: '(555) 020-' + String(1000 + i).slice(-4),
  device: { brand: 'Garmin', model: 'Striker 7', issue: 'Install', photos: [] },
  address: { street: '1 Main St', city: 'Miami', state: 'FL', zip: '33101' },
  slotStartUtc: new Date(Date.now() + (i - 5) * 864e5).toISOString(),
  timezone: 'America/New_York',
  status: (
    ['Pending', 'Confirmed', 'Technician assigned', 'On the way', 'Completed', 'Review requested'] as const
  )[i % 6],
  paymentStatus: 'deposit',
  amount: 14900,
  deposit: 5000,
}));

export const serviceAreaZipPrefixes = ['33', '10', '60', '98', '73', '30', '75', '90', '85', '02'];
