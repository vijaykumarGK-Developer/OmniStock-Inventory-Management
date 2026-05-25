import { useState } from 'react'
import { cn } from '../../utils/cn'

interface InputProps {
  label?: string
  error?: string
  icon?: string
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  name?: string
  disabled?: boolean
  className?: string
}

export function Input({
  label,
  error,
  icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  name,
  disabled,
  className,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label className="font-label-uppercase text-label-uppercase text-on-surface-variant mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
            {icon}
          </span>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary-fixed focus:ring-2 focus:ring-primary-fixed/20 outline-none transition-colors',
            icon && 'pl-10',
            isPassword && 'pr-10',
            error && 'border-error'
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-lg">
              {showPassword ? 'visibility' : 'visibility_off'}
            </span>
          </button>
        )}
      </div>
      {error && <p className="text-error font-body-sm mt-1">{error}</p>}
    </div>
  )
}
