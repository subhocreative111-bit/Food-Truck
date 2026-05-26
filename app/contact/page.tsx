import type { Metadata } from 'next';
import { Mail, MessageCircle, AtSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the FoodTrucksNearMeUSA team.',
};

export default function ContactPage() {
  return (
    <section className="px-6 pb-24 pt-12 md:px-10 md:pt-20">
      <div className="mx-auto max-w-5xl">
        <span className="text-xs font-black uppercase tracking-[0.22em] text-ember">— Contact</span>
        <h1 className="mt-4 break-words text-[clamp(2.75rem,11vw,7.5rem)] font-black leading-[0.92] tracking-tightest">Say hi.</h1>
        <p className="mt-8 max-w-xl text-lg text-ink/65 md:text-xl">
          Press, partnerships, corrections, or just a great truck we should know about — drop a line.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Card icon={<Mail />} title="General" value="hello@foodtrucksnearmeusa.com" href="mailto:hello@foodtrucksnearmeusa.com" />
          <Card icon={<MessageCircle />} title="Press" value="press@foodtrucksnearmeusa.com" href="mailto:press@foodtrucksnearmeusa.com" />
          <Card icon={<AtSign />} title="Social" value="@foodtrucksusa" href="https://instagram.com/" />
        </div>

        <form className="mt-16 grid gap-5 rounded-3xl border border-ink/10 bg-cream-50 p-8 md:p-12">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Your name" name="name" required />
            <Field label="Email" name="email" type="email" required />
          </div>
          <Field label="Subject" name="subject" required />
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/55">Message</span>
            <textarea
              rows={6}
              className="rounded-2xl border border-ink/15 bg-cream px-4 py-3 text-base text-ink placeholder:text-ink/35 focus:border-ember focus:outline-none"
              placeholder="What's on your mind?"
            />
          </label>
          <button type="button" className="btn-primary mt-2 text-base">Send message</button>
        </form>
      </div>
    </section>
  );
}

function Card({ icon, title, value, href }: { icon: React.ReactNode; title: string; value: string; href: string }) {
  return (
    <a
      href={href}
      className="group rounded-2xl border border-ink/10 bg-cream-50 p-6 transition-all duration-500 ease-editorial
                 hover:-translate-y-1 hover:border-ember hover:bg-cream hover:shadow-[0_24px_50px_-20px_rgba(200,70,58,0.3)]"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ember/10 text-ember transition-colors group-hover:bg-ember group-hover:text-cream">
        <span className="h-5 w-5">{icon}</span>
      </span>
      <h3 className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-ink/45">{title}</h3>
      <p className="mt-1 text-base font-bold text-ink">{value}</p>
    </a>
  );
}

function Field({ label, name, type = 'text', required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-ink/55">
        {label}{required && <span className="ml-1 text-ember">*</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="rounded-full border border-ink/15 bg-cream px-5 py-3 text-base text-ink placeholder:text-ink/35 focus:border-ember focus:outline-none"
      />
    </label>
  );
}
