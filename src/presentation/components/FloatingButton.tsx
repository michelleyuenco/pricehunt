import { Link } from 'react-router-dom';

export function FloatingButton() {
  return (
    <Link
      to="/request/new"
      className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center text-3xl font-light hover:bg-primary-600 active:scale-90 transition-all duration-150"
      aria-label="新增需求"
    >
      <span className="leading-none mb-0.5">+</span>
    </Link>
  );
}
