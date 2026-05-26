import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="grain relative isolate flex min-h-[80vh] flex-col items-center justify-center px-6 text-center md:px-10">
      <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— 404</span>
      <h1 className="mt-6 text-7xl font-black tracking-tightest md:text-9xl">
        Off the route<span className="text-ember">.</span>
      </h1>
      <p className="mt-6 max-w-md text-base text-ink/65 md:text-lg">
        That page isn&apos;t on the menu. Head back to the homepage, or browse trucks by state.
      </p>
      <div className="mt-10 flex gap-3">
        <Link href="/" className="btn-primary">Back to home</Link>
        <Link href="/states" className="btn-ghost">Browse states</Link>
      </div>
    </section>
  );
}
