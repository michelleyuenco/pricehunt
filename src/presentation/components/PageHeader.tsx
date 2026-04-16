import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export function PageHeader({ title, subtitle, showBack }: Props) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-[calc(env(safe-area-inset-top)+2.75rem)] lg:top-16 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="touch-compact flex items-center justify-center w-10 h-10 -ml-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="font-bold text-white text-lg leading-tight tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-white/40 truncate">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
