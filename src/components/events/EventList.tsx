import Link from 'next/link'
import { EventCard } from '@/components/events/EventCard'
import { EventStatus, EventVisibility, LocationType, Prisma } from '@prisma/client'

type EventListProps = {
  events: Array<{
    id: string
    title: string
    slug: string
    description: string | null
    startDate: Date
    endDate: Date
    locationType: LocationType
    venue: string | null
    city: string | null
    country: string | null
    onlineUrl: string | null
    coverImage: string | null
    visibility: EventVisibility
    status: EventStatus
    organizer: { orgName: string }
    ticketTypes: Array<{ price: Prisma.Decimal; currency: string }>
  }>
}

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-gray-900 font-medium">No events found</p>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or browse all events.</p>
        <Link href="/events" className="mt-4 inline-flex rounded-md bg-[#5C8BD9] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a7bc9]">
          Clear Filters
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={{
            ...event,
            ticketTypes: event.ticketTypes.map((t) => ({
              price: t.price.toNumber(),
              currency: t.currency,
            })),
          }}
        />
      ))}
    </div>
  )
}
