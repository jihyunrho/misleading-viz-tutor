interface LoadingDotsProps {
  className?: string;
  dotClassName?: string;
}

export default function LoadingDots({
  className = "",
  dotClassName = "",
}: LoadingDotsProps) {
  const containerClasses = `flex items-center space-x-1 ${className}`;
  const baseDotClasses = `w-1 h-1 bg-current rounded-full animate-bounce ${dotClassName}`;

  return (
    <div className={containerClasses}>
      <span className={`${baseDotClasses} [animation-delay:-0.3s]`} />
      <span className={`${baseDotClasses} [animation-delay:-0.15s]`} />
      <span className={`${baseDotClasses}`} />
    </div>
  );
}
