import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getAllPostsSorted } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'Field notes',
  description:
    'Stories and guides from the road — city food-truck scenes, regional cuisine guides, and the trucks worth chasing across all 50 states.',
  alternates: { canonical: '/blog' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function BlogPage() {
  const posts = getAllPostsSorted();
  return (
    <section className="px-6 pb-24 pt-12 md:px-10 md:pt-20">
      <div className="mx-auto max-w-5xl">
        <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— Field notes</span>
        <h1 className="mt-4 break-words text-[clamp(2.75rem,11vw,7.5rem)] font-black leading-[0.92] tracking-tightest">
          From the road.
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-ink/65 md:text-xl">
          Long-form guides, regional scenes, cuisine deep-dives, and arguments about the trucks we&apos;re willing to
          drive for. New pieces published as we eat.
        </p>

        <ul className="mt-16 space-y-6">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex flex-col gap-4 rounded-3xl border border-ink/10 bg-cream-50 p-6 transition-all duration-500 ease-editorial hover:border-ember hover:shadow-[0_24px_50px_-20px_rgba(200,70,58,0.25)] md:flex-row md:items-start md:p-8"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-ember/8 text-3xl">
                  {p.coverEmoji ?? '✍️'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-ink/45">
                    <time dateTime={p.date}>{formatDate(p.date)}</time>
                    <span className="text-ink/20">·</span>
                    <span>{p.readingTime}</span>
                  </div>
                  <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight text-ink transition-colors group-hover:text-ember md:text-3xl">
                    {p.title}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-ink/70">{p.excerpt}</p>
                </div>
                <ArrowUpRight className="hidden h-5 w-5 shrink-0 text-ink/40 transition-all duration-300 ease-editorial group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember md:block" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
