export default function Loading() {
  // You can add a skeleton loader here if you want
  // For now, returning null to be consistent with other loading files
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}