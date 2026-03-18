import { useNavigate } from 'react-router-dom';

interface Props {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export function PageHeader({ title, subtitle, showBack }: Props) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="text-white/50 hover:text-white p-1 -ml-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            ← 
          </button>
        )}
        <div>
          <h1 className="font-bold text-white text-lg leading-tight tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-white/40">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
