import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Field notes',
  description: 'Stories and guides from the road.',
};

export default function BlogPage() {
  return (
    <section className="px-6 pb-24 pt-12 md:px-10 md:pt-20">
      <div className="mx-auto max-w-3xl">
        <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— Field notes</span>
        <h1 className="mt-4 break-words text-[clamp(2.75rem,11vw,7.5rem)] font-black leading-[0.92] tracking-tightest">Coming soon.</h1>
        <p className="mt-8 text-lg text-ink/65 md:text-xl">
          The blog is in the oven. Long-form pieces on city scenes, owner profiles, and the regional dishes worth a
          detour are next up.
        </p>
      </div>
    </section>
  );
}
