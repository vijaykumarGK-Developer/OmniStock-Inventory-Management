import { useRef } from 'react'
import { cn } from '../../utils/cn'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ value, onChange, placeholder = 'Search...', className }: SearchInputProps) {
  const ref = useRef<HTMLInputElement>(null)

  return (
    <div className={cn('relative', className)}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-lg pointer-events-none">
        search
      </span>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-10 pr-10 bg-surface-container border border-surface-variant rounded-xl font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary transition-colors"
      />
      {value && (
        <button
          onClick={() => { onChange(''); ref.current?.focus() }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center hover:bg-surface-container-high text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      )}
    </div>
  )
}
