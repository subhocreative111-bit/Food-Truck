import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { BLOG_POSTS, getPostBySlug, getAllPostsSorted } from '@/lib/blog-posts';

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: { absolute: post.title },
    description: post.metaDescription ?? post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.metaDescription ?? post.excerpt,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getAllPostsSorted().filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription ?? post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'FoodTrucksNearMeUSA' },
    publisher: {
      '@type': 'Organization',
      name: 'FoodTrucksNearMeUSA',
      url: 'https://foodtrucksnearmeusa.com',
    },
    mainEntityOfPage: `https://foodtrucksnearmeusa.com/blog/${post.slug}`,
  };

  // BreadcrumbList — Home › Field notes › Post title
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://foodtrucksnearmeusa.com/' },
      { '@type': 'ListItem', position: 2, name: 'Field notes', item: 'https://foodtrucksnearmeusa.com/blog/' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://foodtrucksnearmeusa.com/blog/${post.slug}/` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <article className="px-6 pb-20 pt-12 md:px-10 md:pt-20">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-ink/55 transition-colors hover:text-ember"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All field notes
          </Link>

          <div className="mt-10">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-ink/45">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="text-ink/20">·</span>
              <span>{post.readingTime}</span>
            </div>
            <h1 className="mt-5 break-words text-[clamp(2.25rem,7vw,4.5rem)] font-black leading-[0.98] tracking-tightest">
              {post.title}
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-ink/70">{post.excerpt}</p>
          </div>

          <div className="prose-blog mt-14">{post.render()}</div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-cream-50 px-6 py-20 md:px-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-xs font-black uppercase tracking-[0.22em] text-ember">— Keep reading</h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    className="group flex h-full flex-col gap-4 rounded-3xl border border-ink/10 bg-cream p-6 transition-all duration-500 ease-editorial hover:border-ember hover:shadow-[0_24px_50px_-20px_rgba(200,70,58,0.25)]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember/8 text-2xl">
                      {r.coverEmoji ?? '✍️'}
                    </div>
                    <h3 className="text-lg font-black leading-tight tracking-tight text-ink transition-colors group-hover:text-ember">
                      {r.title}
                    </h3>
                    <p className="line-clamp-3 text-sm text-ink/65">{r.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
