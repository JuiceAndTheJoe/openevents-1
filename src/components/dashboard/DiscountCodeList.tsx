'use client'

import { useState, useTransition } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useToast } from '@/components/ui/toaster'

type DiscountCode = {
  id: string
  code: string
  discountType: string
  discountValue: number
  usedCount: number
  maxUses: number | null
  isActive: boolean
}

type DiscountCodeListProps = {
  discountCodes: DiscountCode[]
  deleteAction: (formData: FormData) => Promise<void>
}

export function DiscountCodeList({ discountCodes, deleteAction }: DiscountCodeListProps) {
  const showToast = useToast()
  const [pendingDelete, setPendingDelete] = useState<DiscountCode | null>(null)
  const [isPending, startTransition] = useTransition()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  async function copyToClipboard(code: string, id: string) {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      showToast('Failed to copy to clipboard', 'error')
    }
  }

  function handleConfirmDelete() {
    if (!pendingDelete) return
    const formData = new FormData()
    formData.append('discountCodeId', pendingDelete.id)
    startTransition(async () => {
      try {
        await deleteAction(formData)
        showToast('Discount code deleted')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Could not delete the discount code. Please try again.'
        showToast(message, 'error')
      } finally {
        setPendingDelete(null)
      }
    })
  }

  return (
    <>
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Discount Codes</h2>
        {discountCodes.length === 0 ? (
          <p className="mt-3 text-sm text-gray-600">No discount codes configured.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {discountCodes.map((discountCode) => (
              <div key={discountCode.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-100 p-3">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{discountCode.code}</p>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(discountCode.code, discountCode.id)}
                        className="inline-flex items-center justify-center rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        title="Copy code"
                      >
                        {copiedId === discountCode.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      {copiedId === discountCode.id && (
                        <span className="text-xs text-green-600">Copied!</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {discountCode.discountType} · Value: {discountCode.discountValue} · Tickets used: {discountCode.usedCount}/{discountCode.maxUses ?? 'Unlimited'} · {discountCode.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setPendingDelete(discountCode)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete discount code "${pendingDelete?.code}"?`}
        description="This will permanently delete the discount code. Any attendees who have already used it will not be affected."
        confirmLabel="Delete Code"
        isLoading={isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </>
  )
}
