import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Why FoodTrucksNearMeUSA exists, and how we keep listings honest.',
};

export default function AboutPage() {
  return (
    <section className="px-6 pb-24 pt-12 md:px-10 md:pt-20">
      <div className="mx-auto max-w-3xl">
        <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— About</span>
        <h1 className="mt-4 break-words text-[clamp(2.75rem,11vw,7.5rem)] font-black leading-[0.92] tracking-tightest">
          Eat well, eat local.
        </h1>
        <p className="mt-8 text-xl leading-relaxed text-ink/75">
          FoodTrucksNearMeUSA is a hand-curated directory of independent food trucks, taco stands, BBQ rigs and
          roadside eateries across all 50 states.
        </p>

        <div className="prose mt-12 space-y-6 text-base leading-relaxed text-ink/75">
          <p>
            We started this project because the food-truck scene in America is one of the most underrated culinary
            forces in the world — and the existing directories felt like phone books from 2003.
          </p>
          <p>
            Every listing on the site is reviewed before it goes live. We aggregate ratings from public sources, then
            layer in editorial picks from a small team of local correspondents.
          </p>
          <p>
            If you run a truck, <a href="/list-your-truck" className="font-bold text-ember underline-offset-4 hover:underline">claim your listing</a>.
            If you spot something wrong, <a href="/contact" className="font-bold text-ember underline-offset-4 hover:underline">tell us</a>.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {[
            { label: 'Founded', value: '2026' },
            { label: 'States covered', value: '50' },
            { label: 'New trucks / week', value: '40+' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-ink/10 bg-cream-50 p-6">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-ink/40">{s.label}</div>
              <div className="tabular mt-2 text-4xl font-black tracking-tightest">{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
