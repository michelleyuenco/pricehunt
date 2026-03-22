import { useState } from 'react';
import type { Timestamp } from 'firebase/firestore';
import { getBadgeById } from '../../domain/constants/badges';

interface PriceTimestampProps {
  date: Timestamp | { seconds: number } | Date | null | undefined;
  source: 'user' | 'official';
  userName?: string;
  userBadges?: string[];
  className?: string;
}

function getDateObj(date: Timestamp | { seconds: number } | Date | null | undefined): Date | null {
  if (!date) return null;
  if (date instanceof Date) return date;
  if ('toDate' in date && typeof (date as Timestamp).toDate === 'function') return (date as Timestamp).toDate();
  if ('seconds' in date) return new Date((date as { seconds: number }).seconds * 1000);
  return null;
}

function getFreshnessInfo(d: Date): { dot: string; label: string; labelEn: string } {
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    return { dot: 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]', label: '最新', labelEn: 'Fresh' };
  } else if (diffHours < 24 * 7) {
    return { dot: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]', label: '近期', labelEn: 'Recent' };
  } else {
    return { dot: 'bg-white/30', label: '可能已過時', labelEn: 'May be outdated' };
  }
}

function getRelativeTime(d: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return '剛剛';
  if (diffMins < 60) return `${diffMins} 分鐘前`;
  if (diffHours < 24) return `${diffHours} 小時前`;
  if (diffDays < 7) return `${diffDays} 天前`;
  return d.toLocaleDateString('zh-HK', { month: 'short', day: 'numeric' });
}

export function PriceTimestamp({ date, source, userName, userBadges = [], className = '' }: PriceTimestampProps) {
  const [showAbsolute, setShowAbsolute] = useState(false);
  const d = getDateObj(date);

  if (!d) return null;

  const freshness = getFreshnessInfo(d);
  const relTime = getRelativeTime(d);
  const absoluteDate = d.toLocaleDateString('zh-HK', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  });

  const badgeIcons = userBadges
    .slice(0, 3)
    .map(id => getBadgeById(id)?.icon ?? '')
    .filter(Boolean)
    .join('');

  return (
    <button
      type="button"
      className={`flex items-center gap-1.5 text-left group ${className}`}
      onClick={() => setShowAbsolute(v => !v)}
      title={showAbsolute ? relTime : absoluteDate}
    >
      {/* Freshness dot */}
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${freshness.dot}`} />

      {source === 'official' ? (
        <span className="text-[11px] text-blue-400/80">
          🏛️ 消費者委員會
          {' · '}
          <span className="text-white/30">{showAbsolute ? absoluteDate : relTime}</span>
        </span>
      ) : (
        <span className="text-[11px] text-white/40">
          {userName && (
            <>
              <span className="text-white/60">{userName}</span>
              {badgeIcons && <span className="ml-0.5">{badgeIcons}</span>}
              {' · '}
            </>
          )}
          <span className={freshness.dot.includes('white') ? 'text-white/25 italic' : ''}>
            {showAbsolute ? absoluteDate : relTime}
          </span>
          {freshness.dot.includes('white/30') && (
            <span className="ml-1 text-[10px] text-white/25">({freshness.label})</span>
          )}
        </span>
      )}
    </button>
  );
}
