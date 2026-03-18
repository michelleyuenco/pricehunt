export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-white/10 border-t-green-500 rounded-full animate-spin shadow-[0_0_15px_rgba(34,197,94,0.2)]" />
    </div>
  );
}
