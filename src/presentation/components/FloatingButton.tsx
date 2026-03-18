import { Link } from 'react-router-dom';

export function FloatingButton() {
  return (
    <Link
      to="/request/new"
      className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full shadow-[0_0_30px_rgba(34,197,94,0.3)] flex items-center justify-center hover:scale-110 hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] active:scale-90 transition-all duration-200"
      aria-label="新增需求"
    >
      <span className="text-2xl font-light leading-none animate-pulse">+</span>
    </Link>
  );
}
