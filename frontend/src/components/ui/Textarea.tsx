import { cn } from '../../utils/cn'

interface TextareaProps {
  label?: string
  error?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  rows?: number
  maxLength?: number
  disabled?: boolean
}

export function Textarea({
  label,
  error,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  disabled,
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-label-uppercase text-label-uppercase text-on-surface-variant mb-1">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        className={cn(
          'w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary-fixed focus:ring-2 focus:ring-primary-fixed/20 outline-none transition-colors resize-y',
          error && 'border-error'
        )}
      />
      <div className="flex justify-between items-center">
        {error && <p className="text-error font-body-sm">{error}</p>}
        {maxLength && (
          <span className="text-on-surface-variant/50 text-sm ml-auto">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
}
