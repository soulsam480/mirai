import React from 'react'
import { Control, Controller, FieldError } from 'react-hook-form'

interface Props {
  error?: FieldError
  label: string
  name: string
  control: Control<any, any>
}

export const MCheckbox: React.FC<Props> = ({ error, label, name, control }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, ref, value, onBlur } }) => {
        return (
          <div className="flex flex-col">
            <label className="cursor-pointer label">
              <span className="label-text">{label}</span>
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={value}
                onChange={(e) => {
                  onChange?.(e.target.checked as any)
                }}
                ref={ref}
                onBlur={onBlur}
              />
            </label>
            <label className="label">
              {error != null && <span className="label-text-alt"> {error.message} </span>}{' '}
            </label>
          </div>
        )
      }}
    />
  )
}

MCheckbox.displayName = 'MCheckbox'
