import { useNavigate } from 'react-router-dom';

interface Props {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export function PageHeader({ title, subtitle, showBack }: Props) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 p-1 -ml-1 rounded-lg active:bg-gray-100"
          >
            ← 
          </button>
        )}
        <div>
          <h1 className="font-bold text-charcoal text-lg leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
