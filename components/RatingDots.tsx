export interface RatingDotsProps {
  rating: number; // 0..5
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
  className?: string;
}

const SIZE_MAP = {
  sm: 'h-1.5 w-1.5 gap-1',
  md: 'h-2 w-2 gap-1.5',
  lg: 'h-2.5 w-2.5 gap-2',
};

export default function RatingDots({ rating, size = 'md', showNumber, reviewCount, className = '' }: RatingDotsProps) {
  const filled = Math.round(rating);
  const sz = SIZE_MAP[size];
  const dotSize = sz.split(' ').slice(0, 2).join(' ');
  const gap = sz.split(' ')[2];

  return (
    <div className={`flex items-center ${gap} ${className}`} aria-label={`Rated ${rating} out of 5`}>
      <div className={`flex items-center ${gap}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`rounded-full ${dotSize} ${
              i < filled ? 'bg-saffron' : 'border border-ink/20 bg-transparent'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="ml-1 tabular text-xs font-bold text-ink/75">
          {rating.toFixed(1)}
          {reviewCount != null && (
            <span className="ml-1 font-normal text-ink/45">({reviewCount.toLocaleString()})</span>
          )}
        </span>
      )}
    </div>
  );
}
