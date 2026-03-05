import { Input } from '@/components/ui/input'

type EventFiltersProps = {
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
  initial: {
    search?: string
    category?: string
    location?: string
    startDate?: string
    endDate?: string
  }
}

export function EventFilters({ categories, initial }: EventFiltersProps) {
  return (
    <form className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-5" method="GET">
      <Input
        name="search"
        defaultValue={initial.search}
        placeholder="Search events"
      />
      <select
        name="category"
        defaultValue={initial.category ?? ''}
        aria-label="Filter by category"
        className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
      <Input
        name="location"
        defaultValue={initial.location}
        placeholder="Location"
      />
      <Input
        type="date"
        name="startDate"
        defaultValue={initial.startDate}
      />
      <Input
        type="date"
        name="endDate"
        defaultValue={initial.endDate}
      />
      <div className="md:col-span-5 flex justify-end">
        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Apply Filters
        </button>
      </div>
    </form>
  )
}
