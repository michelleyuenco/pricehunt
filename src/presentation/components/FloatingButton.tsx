import { useState } from 'react';
import { Plus, X, ClipboardList, Tag } from 'lucide-react';
import { LocaleLink } from './LocaleLink';
import { useLanguage } from '../../application/context/LanguageContext';

export function FloatingButton() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2 lg:bottom-8 lg:right-8 lg:hidden">
      {/* Sub-actions (expanded) */}
      {open && (
        <div className="flex flex-col items-end gap-2 mb-1">
          <LocaleLink
            to="/record"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 bg-purple-600 text-white font-semibold text-sm px-4 py-2.5 rounded-full shadow-[0_4px_20px_rgba(147,51,234,0.4)] hover:bg-purple-500 active:scale-95 transition-all"
          >
            <Tag size={15} className="text-current" />
            <span>{t('record.title') || '記錄價格'}</span>
          </LocaleLink>
          <LocaleLink
            to="/request/new"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 bg-emerald-600 text-white font-semibold text-sm px-4 py-2.5 rounded-full shadow-[0_4px_20px_rgba(5,150,105,0.4)] hover:bg-emerald-500 active:scale-95 transition-all"
          >
            <ClipboardList size={15} className="text-current" />
            <span>{t('nav.newRequest') || '發起需求'}</span>
          </LocaleLink>
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-200 glow-pulse hover:[animation:none] ${
          open
            ? 'bg-white/10 border border-white/20 hover:bg-white/15'
            : 'bg-gradient-to-br from-green-500 to-emerald-500 hover:scale-110 hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] active:scale-90'
        }`}
        aria-label={open ? '關閉' : '新增'}
      >
        {open ? (
          <X size={24} className="text-white" />
        ) : (
          <Plus size={24} className="text-white animate-pulse" />
        )}
      </button>
    </div>
  );
}
