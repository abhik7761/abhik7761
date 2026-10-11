export const Stars = ({ rating }: { rating: number }) => (
  <span aria-label={`${rating.toFixed(1)} out of 5 stars`} className="text-amber-500">
    {'★'.repeat(Math.round(rating))}
    <span className="text-slate-300">{'★'.repeat(5 - Math.round(rating))}</span>
  </span>
);
