'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DownloadTicketsButton() {
  return (
    <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
      <Download className="mr-1.5 h-4 w-4" aria-hidden="true" />
      Download Tickets as PDF
    </Button>
  )
}
