export default function LoadingDots() {
  return (
    <div className="flex items-center space-x-1">
      <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1 h-1 bg-current rounded-full animate-bounce" />
    </div>
  );
}
