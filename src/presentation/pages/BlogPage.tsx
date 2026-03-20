import { FileText } from "lucide-react";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { blogPosts } from '../../infrastructure/data/blogPosts';
import type { BlogPost } from '../../domain/entities/BlogPost';
import { useLanguage } from '../../application/context/LanguageContext';

const CATEGORY_COLORS: Record<BlogPost['category'], string> = {
  comparison: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  guide: 'bg-green-500/20 text-green-300 border-green-500/30',
  tips: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  trend: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  tutorial: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

function formatDate(iso: string, lang: string) {
  return new Date(iso).toLocaleDateString(lang === 'zh' ? 'zh-HK' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function BlogPage() {
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<BlogPost['category'] | 'all'>('all');

  const getCategoryLabel = (cat: BlogPost['category']): string => {
    const key = `blog.cat.${cat}` as string;
    return t(key);
  };

  const categories = Array.from(new Set(blogPosts.map(p => p.category)));

  const filtered = activeCategory === 'all'
    ? blogPosts
    : blogPosts.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="h-12 lg:h-16" />

      <div className="max-w-5xl mx-auto px-4 py-8 pb-24 lg:pb-8">
        {/* Hero header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 text-green-400 text-sm font-medium mb-4">
            <FileText size={16} className="text-current" />
            <span>{t('blog.title')}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">
            {t('blog.heading')} <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-white/50 text-base max-w-xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Category filter chips */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              activeCategory === 'all'
                ? 'bg-green-500/20 text-green-300 border-green-500/40'
                : 'bg-white/5 text-white/40 border-white/10 hover:text-white/70 hover:bg-white/10'
            }`}
          >
            {t('blog.filter.all')}
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeCategory === cat
                  ? CATEGORY_COLORS[cat]
                  : 'bg-white/5 text-white/40 border-white/10 hover:text-white/70 hover:bg-white/10'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Blog grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map(post => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-green-500/30 hover:bg-green-500/[0.03] transition-all duration-200 active:scale-[0.98] flex flex-col"
            >
              {/* Category + reading time */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${CATEGORY_COLORS[post.category]}`}>
                  {getCategoryLabel(post.category)}
                </span>
                <span className="text-white/30 text-xs">{post.readingTime} {t('blog.readTime')}</span>
              </div>

              {/* Title — always show Chinese; add "(Chinese)" label in English mode */}
              <h2 className="text-white font-bold text-base leading-snug mb-2 group-hover:text-green-300 transition-colors line-clamp-2">
                {post.title}
                {lang === 'en' && <span className="text-white/30 text-xs font-normal ml-1">(Chinese)</span>}
              </h2>

              {/* Excerpt */}
              <p className="text-white/50 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
                {post.excerpt}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 border border-green-500/30 flex items-center justify-center text-xs">
                    ✍️
                  </div>
                  <span className="text-white/40 text-xs">{post.author}</span>
                </div>
                <span className="text-white/30 text-xs">{formatDate(post.publishedAt, lang)}</span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <p className="text-4xl mb-3">📭</p>
            <p>{t('blog.empty')}</p>
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
}
