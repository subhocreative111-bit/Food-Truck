'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  align?: 'left' | 'center';
}

export default function SectionHeader({ eyebrow, title, description, href, hrefLabel = 'See all', align = 'left' }: Props) {
  const center = align === 'center';
  return (
    <div className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${center ? 'md:items-center md:text-center' : ''}`}>
      <div className={center ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-black uppercase tracking-[0.22em] text-ember"
          >
            — {eyebrow}
          </motion.span>
        )}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 text-4xl font-black tracking-tightest text-ink md:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 max-w-xl text-base leading-relaxed text-ink/65 md:text-lg"
          >
            {description}
          </motion.p>
        )}
      </div>
      {href && (
        <Link href={href} className="btn-ghost group shrink-0 self-start text-sm md:self-end">
          {hrefLabel}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
    </div>
  );
}
