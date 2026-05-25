import { cn } from '../../utils/cn'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  error?: string
  options: SelectOption[]
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  placeholder?: string
  disabled?: boolean
}

export function Select({
  label,
  error,
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-label-uppercase text-label-uppercase text-on-surface-variant mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            'w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-3 pr-10 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary-fixed focus:ring-2 focus:ring-primary-fixed/20 outline-none transition-colors appearance-none cursor-pointer',
            !value && 'text-on-surface-variant',
            error && 'border-error'
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
          expand_more
        </span>
      </div>
      {error && <p className="text-error font-body-sm mt-1">{error}</p>}
    </div>
  )
}
