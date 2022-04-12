import clsx from 'clsx'
import React, { HTMLProps } from 'react'
import { Control, Controller, FieldError, useFormContext } from 'react-hook-form'

interface Props extends Omit<HTMLProps<HTMLInputElement>, 'checked' | 'type' | 'onChange' | 'onBlur'> {
  error?: FieldError
  label: string
  name: string
  control?: Control<any, any>
}

export const MCheckbox: React.FC<Props> = ({ error, label, name, control: _control, ...rest }) => {
  const ctx = useFormContext()
  const control = ctx !== null ? ctx.control : _control

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, ref, value, onBlur }, fieldState: { error: _error } }) => {
        const fieldError = _error ?? error

        return (
          <div className="flex flex-col">
            <label className={clsx(['label', rest.disabled === true ? 'cursor-not-allowed' : 'cursor-pointer'])}>
              <span className="label-text">{label}</span>
              <input
                {...rest}
                type="checkbox"
                className={clsx(['checkbox checkbox-primary checkbox-sm', rest.className])}
                checked={value}
                onChange={(e) => {
                  onChange?.(e.target.checked as any)
                }}
                ref={ref}
                onBlur={onBlur}
              />
            </label>

            <label className="label">
              {fieldError !== undefined && <span className="label-text-alt"> {fieldError.message} </span>}{' '}
            </label>
          </div>
        )
      }}
    />
  )
}

MCheckbox.displayName = 'MCheckbox'
