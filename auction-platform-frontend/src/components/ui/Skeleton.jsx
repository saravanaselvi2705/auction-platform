

export default function Skeleton({ className = "", variant = "rect" }) {
  const base = "animate-pulse bg-gray-200";
  const styles = {
    rect: "rounded-lg",
    circle: "rounded-full",
    text: "h-4 rounded w-3/4",
  };

  return <div className={`${base} ${styles[variant]} ${className}`} />;
}

Skeleton.Card = function SkeletonCard() {
  return (
    <div className="border border-gray-100 rounded-xl p-5 space-y-4 shadow-sm bg-white">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-6 w-2/3" variant="text" />
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-4 w-1/3" variant="text" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
};
