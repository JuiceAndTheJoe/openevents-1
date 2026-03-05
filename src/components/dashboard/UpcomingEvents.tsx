import Link from 'next/link'
import { EventStatus } from '@prisma/client'
import { EventStatusBadge } from '@/components/dashboard/EventStatusBadge'
import { formatDateTime } from '@/lib/utils'

type UpcomingEventsProps = {
  events: Array<{
    id: string
    slug: string
    title: string
    startDate: Date
    status: EventStatus
  }>
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
        <Link href="/dashboard/events" className="text-sm text-[#5C8BD9] hover:text-[#4a7ac8]">
          View all
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-6">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">No upcoming events yet.</p>
          <Link href="/create-event" className="mt-3 inline-flex rounded-md bg-[#5C8BD9] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#4a7bc9]">
            Create Event
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="rounded-lg border border-gray-100 p-3">
              <div className="flex items-center justify-between gap-2">
                <Link href={`/dashboard/events/${event.id}`} className="font-medium text-gray-900 hover:text-[#5C8BD9]">
                  {event.title}
                </Link>
                <EventStatusBadge status={event.status} />
              </div>
              <p className="mt-1 text-sm text-gray-600">{formatDateTime(event.startDate)}</p>
              <Link href={`/events/${event.slug}`} className="mt-1 inline-block text-xs text-gray-500 hover:text-gray-700">
                Open public page
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
