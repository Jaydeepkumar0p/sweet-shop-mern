export function ProductSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="bg-gray-100 aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-gray-100 rounded-full skeleton" />
        <div className="h-4 w-3/4 bg-gray-100 rounded-full skeleton" />
        <div className="h-3 w-20 bg-gray-100 rounded-full skeleton" />
        <div className="flex justify-between items-center">
          <div className="h-5 w-16 bg-gray-100 rounded-full skeleton" />
          <div className="w-9 h-9 rounded-full bg-gray-100 skeleton" />
        </div>
      </div>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-pink-100 border-t-pink-500 animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-xl">🍬</span>
      </div>
      <p className="text-gray-500 font-medium animate-pulse">Loading sweets...</p>
    </div>
  )
}

export function InlineLoader() {
  return (
    <div className="flex justify-center py-8">
      <div className="w-8 h-8 rounded-full border-3 border-pink-100 border-t-pink-500 animate-spin" />
    </div>
  )
}
