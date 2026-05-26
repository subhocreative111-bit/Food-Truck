export default function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="relative isolate overflow-hidden border-y border-ink/10 bg-ink py-5 text-cream">
      <div className="marquee-track flex animate-marquee gap-12 whitespace-nowrap">
        {loop.map((s, i) => (
          <span key={i} className="flex items-center gap-12 text-base font-black uppercase tracking-[0.18em] md:text-lg">
            {s}
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-saffron" />
          </span>
        ))}
      </div>
    </div>
  );
}
