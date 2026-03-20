import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../application/context/LanguageContext';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { blogPosts } from '../../infrastructure/data/blogPosts';
import type { BlogPost } from '../../domain/entities/BlogPost';

const CATEGORY_LABELS: Record<BlogPost['category'], string> = {
  comparison: '比較',
  guide: '指南',
  tips: '慳錢貼士',
  trend: '趨勢',
  tutorial: '教學',
};

const CATEGORY_COLORS: Record<BlogPost['category'], string> = {
  comparison: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  guide: 'bg-green-500/20 text-green-300 border-green-500/30',
  tips: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  trend: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  tutorial: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('zh-HK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function extractToc(html: string): { id: string; text: string }[] {
  const matches = [...html.matchAll(/<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/gi)];
  return matches.map(m => ({
    id: m[1],
    text: m[2].replace(/<[^>]*>/g, '').replace(/^[^\w\u4e00-\u9fff]+/, '').trim(),
  }));
}

export function BlogArticlePage() {
  const { t } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  const related = useMemo(() => {
    if (!post) return [];
    return blogPosts
      .filter(p => p.slug !== post.slug && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
      .slice(0, 3);
  }, [post]);

  const toc = useMemo(() => post ? extractToc(post.content) : [], [post]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (post) {
      document.title = post.metaTitle || post.title;
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', post.metaDescription);
    }
    return () => {
      document.title = 'PriceHunt 格價獵人';
    };
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="h-12 lg:h-16" />

      <div className="max-w-7xl mx-auto px-4 py-8 pb-24 lg:pb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/30 mb-6">
          <Link to="/" className="hover:text-white/60 transition-colors">{t("nav.home")}</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-white/60 transition-colors">{t("nav.blog")}</Link>
          <span>/</span>
          <span className="text-white/50 truncate max-w-xs">{post.title}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
          {/* Main article */}
          <main>
            {/* Article header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[post.category]}`}>
                  {CATEGORY_LABELS[post.category]}
                </span>
                <span className="text-white/30 text-sm">{post.readingTime} 分鐘閱讀</span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-4">
                {post.title}
              </h1>

              <p className="text-white/60 text-base leading-relaxed mb-5">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between py-4 border-t border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 border border-green-500/30 flex items-center justify-center text-sm">
                    ✍️
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium">{post.author}</p>
                    <p className="text-white/30 text-xs">{formatDate(post.publishedAt)}</p>
                  </div>
                </div>
                {/* Share buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10 text-xs transition-all"
                  >
                    {copied ? '✓ 已複製' : '🔗 複製鏈接'}
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 text-xs transition-all"
                  >
                    💬 WhatsApp
                  </button>
                </div>
              </div>
            </header>

            {/* Article content */}
            <div
              className="blog-content text-white/70 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/[0.08]">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs">
                  #{tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <p className="text-white font-bold text-lg mb-2">💡 想即時格價？</p>
              <p className="text-white/60 text-sm mb-4">唔使逐間超市行！格價獵人即時比較香港各大超市、藥妝、街市最新價格。</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-5 py-2.5 rounded-full hover:from-green-400 hover:to-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              >
                用格價獵人即時格價 →
              </Link>
            </div>

            {/* Share again at bottom */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-white/30 text-sm">分享文章：</span>
              <button onClick={handleCopyLink} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white/80 text-xs transition-all">
                {copied ? '✓ 已複製' : '🔗 複製'}
              </button>
              <button onClick={handleWhatsApp} className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs hover:bg-green-500/20 transition-all">
                💬 WhatsApp
              </button>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-bold text-white mb-5">📚 相關文章</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {related.map(r => (
                    <Link
                      key={r.slug}
                      to={`/blog/${r.slug}`}
                      className="group bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 hover:border-green-500/30 hover:bg-green-500/[0.03] transition-all"
                    >
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border mb-2 ${CATEGORY_COLORS[r.category]}`}>
                        {CATEGORY_LABELS[r.category]}
                      </span>
                      <p className="text-white/80 text-sm font-semibold leading-snug group-hover:text-green-300 transition-colors line-clamp-2">
                        {r.title}
                      </p>
                      <p className="text-white/30 text-xs mt-2">{r.readingTime} 分鐘閱讀</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* TOC Sidebar (desktop only) */}
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">目錄</p>
                <nav className="space-y-1">
                  {toc.map(item => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm text-white/40 hover:text-white/80 py-1.5 px-3 rounded-lg hover:bg-white/5 transition-all leading-snug"
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
                <div className="mt-6 pt-5 border-t border-white/[0.08]">
                  <Link
                    to="/"
                    className="block text-center text-sm font-semibold text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl py-2.5 hover:bg-green-500/20 transition-all"
                  >
                    即時格價
                  </Link>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      <Navbar />
    </div>
  );
}
