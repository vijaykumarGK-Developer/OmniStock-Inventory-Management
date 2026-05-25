import { useCart } from './CartContext'
import { Input } from '../ui/Input'
import { formatCurrency } from '../../utils/formatCurrency'

const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'credit', label: 'Credit' },
] as const

interface CartPanelProps {
  onPlaceOrder: () => void
  placing: boolean
}

export function CartPanel({ onPlaceOrder, placing }: CartPanelProps) {
  const { state, subtotal, tax, total, itemsCount, dispatch } = useCart()

  return (
    <div className="bg-surface-container border border-surface-variant rounded-2xl p-6 sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant">shopping_cart</span>
          <h2 className="font-title-md text-title-md text-on-surface">Current Cart</h2>
          {itemsCount > 0 && (
            <span className="bg-primary-container text-primary-fixed text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{itemsCount}</span>
          )}
        </div>
        {itemsCount > 0 && (
          <button onClick={() => dispatch({ type: 'CLEAR_CART' })} className="text-error/80 hover:text-error font-body-sm text-body-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">delete_sweep</span>
            Clear
          </button>
        )}
      </div>

      {state.items.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">shopping_cart</span>
          <p className="font-body-md text-body-md text-on-surface-variant">Cart is empty</p>
        </div>
      ) : (
        <>
          <div className="max-h-[400px] overflow-y-auto space-y-3 mb-4">
            {state.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 bg-surface-container-low rounded-xl p-3">
                <div className="flex-1 min-w-0">
                  <p className="font-body-md text-body-md text-on-surface truncate">{item.productName}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{formatCurrency(item.price)} each</p>
                </div>
                <div className="flex items-center border border-surface-variant rounded-lg bg-surface-container overflow-hidden">
                  <button
                    onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { productId: item.productId, quantity: item.quantity - 1 } })}
                    className="w-9 h-9 flex items-center justify-center hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="w-12 text-center font-body-md text-body-md text-on-surface">{item.quantity}</span>
                  <button
                    onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { productId: item.productId, quantity: item.quantity + 1 } })}
                    className="w-9 h-9 flex items-center justify-center hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
                <p className="font-body-md text-body-md text-on-surface w-16 text-right">{formatCurrency(item.price * item.quantity)}</p>
                <button
                  onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.productId })}
                  className="text-on-surface-variant hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-surface-variant/50 pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-body-md text-body-md text-on-surface-variant">Subtotal</span>
              <span className="font-body-md text-body-md text-on-surface">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-body-md text-body-md text-on-surface-variant shrink-0">Discount</span>
              <Input
                type="number"
                min="0"
                value={String(state.discount)}
                onChange={(e) => dispatch({ type: 'SET_DISCOUNT', payload: Number(e.target.value) || 0 })}
                className="h-8 text-sm"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body-md text-body-md text-on-surface-variant">Tax (18%)</span>
              <span className="font-body-md text-body-md text-on-surface">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-surface-variant/30">
              <span className="font-title-md text-title-md text-on-surface">Total</span>
              <span className="font-title-md text-title-md text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <Input label="Customer Name" value={state.customerName} onChange={(e) => dispatch({ type: 'SET_CUSTOMER_NAME', payload: e.target.value })} />
            <Input label="Phone" value={state.customerPhone} onChange={(e) => dispatch({ type: 'SET_CUSTOMER_PHONE', payload: e.target.value })} />
          </div>

          <div className="mt-4">
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">Payment Method</p>
            <div className="flex gap-2">
              {paymentMethods.map((pm) => (
                <button
                  key={pm.value}
                  onClick={() => dispatch({ type: 'SET_PAYMENT_METHOD', payload: pm.value })}
                  className={`flex-1 py-2 rounded-lg text-center font-body-sm cursor-pointer transition-all ${
                    state.paymentMethod === pm.value
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {pm.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onPlaceOrder}
            disabled={placing || state.items.length === 0}
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white py-4 rounded-xl font-title-sm shadow-lg hover:opacity-90 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
        </>
      )}
    </div>
  )
}
