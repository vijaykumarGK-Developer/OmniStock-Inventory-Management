import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import type { Sale } from '../../../shared/types'

interface InvoiceModalProps {
  sale: Sale | null
  isOpen: boolean
  onClose: () => void
  onNewSale: () => void
}

export function InvoiceModal({ sale, isOpen, onClose, onNewSale }: InvoiceModalProps) {
  if (!sale) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button onClick={onNewSale}>New Sale</Button>
        </>
      }
    >
      <div className="text-center mb-6">
        <span className="material-symbols-outlined text-4xl text-secondary">check_circle</span>
        <h2 className="font-headline-md text-headline-md text-on-surface mt-2">Sale Complete!</h2>
      </div>

      <div className="flex justify-between items-center mb-6 bg-surface-container-low rounded-xl p-4">
        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Invoice</p>
          <p className="font-title-md text-title-md text-on-surface">{sale.invoiceNo}</p>
        </div>
        <div className="text-right">
          <p className="font-label-sm text-label-sm text-on-surface-variant">Date</p>
          <p className="font-body-md text-body-md text-on-surface">{formatDate(sale.createdAt, 'long')}</p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {sale.items.map((item, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-surface-variant/20">
            <div>
              <p className="font-body-md text-body-md text-on-surface">{item.productName}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{item.quantity} x {formatCurrency(item.unitPrice)}</p>
            </div>
            <p className="font-body-md text-body-md text-on-surface">{formatCurrency(item.total)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-surface-variant/50 pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="font-body-md text-body-md text-on-surface-variant">Subtotal</span>
          <span className="font-body-md text-body-md text-on-surface">{formatCurrency(sale.subtotal)}</span>
        </div>
        {sale.discount > 0 && (
          <div className="flex justify-between">
            <span className="font-body-md text-body-md text-on-surface-variant">Discount</span>
            <span className="font-body-md text-body-md text-error">-{formatCurrency(sale.discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="font-body-md text-body-md text-on-surface-variant">Tax (18%)</span>
          <span className="font-body-md text-body-md text-on-surface">{formatCurrency(sale.tax)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-surface-variant/30">
          <span className="font-title-md text-title-md text-on-surface">Total</span>
          <span className="font-title-md text-title-md text-primary">{formatCurrency(sale.total)}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-center">
        <div className="bg-surface-container-low rounded-xl p-3">
          <p className="font-label-sm text-label-sm text-on-surface-variant">Payment</p>
          <p className="font-body-md text-body-md text-on-surface capitalize">{sale.paymentMethod}</p>
        </div>
        <div className="bg-surface-container-low rounded-xl p-3">
          <p className="font-label-sm text-label-sm text-on-surface-variant">Customer</p>
          <p className="font-body-md text-body-md text-on-surface">{sale.customerName}</p>
        </div>
      </div>
    </Modal>
  )
}
