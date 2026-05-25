import { createContext, useContext, useReducer, useMemo, type ReactNode } from 'react'

export interface CartItem {
  productId: number
  productName: string
  price: number
  quantity: number
  stock: number
}

interface CartState {
  items: CartItem[]
  customerName: string
  customerPhone: string
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit'
  discount: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QTY'; payload: { productId: number; quantity: number } }
  | { type: 'SET_CUSTOMER_NAME'; payload: string }
  | { type: 'SET_CUSTOMER_PHONE'; payload: string }
  | { type: 'SET_PAYMENT_METHOD'; payload: 'cash' | 'card' | 'upi' | 'credit' }
  | { type: 'SET_DISCOUNT'; payload: number }
  | { type: 'CLEAR_CART' }

const initialState: CartState = {
  items: [],
  customerName: 'Walk-in Customer',
  customerPhone: '',
  paymentMethod: 'cash',
  discount: 0,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.productId === action.payload.productId)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.productId !== action.payload) }
    case 'UPDATE_QTY': {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.productId !== action.payload.productId) }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.payload.productId
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      }
    }
    case 'SET_CUSTOMER_NAME':
      return { ...state, customerName: action.payload }
    case 'SET_CUSTOMER_PHONE':
      return { ...state, customerPhone: action.payload }
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload }
    case 'SET_DISCOUNT':
      return { ...state, discount: action.payload }
    case 'CLEAR_CART':
      return initialState
    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  subtotal: number
  tax: number
  total: number
  itemsCount: number
  dispatch: React.Dispatch<CartAction>
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const { subtotal, tax, total, itemsCount } = useMemo(() => {
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const tax = subtotal * 0.18
    const total = subtotal + tax - state.discount
    const itemsCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
    return { subtotal, tax, total, itemsCount }
  }, [state.items, state.discount])

  return (
    <CartContext.Provider value={{ state, subtotal, tax, total, itemsCount, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
