import clsx from 'clsx'
import React, { HTMLProps, PropsWithoutRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { OverWrite } from '../../types'
import { mergeRefs } from '../../utils'

interface Props
  extends OverWrite<
    PropsWithoutRef<HTMLProps<HTMLInputElement>>,
    {
      label: string
      name: string
      value?: boolean
    }
  > {}

const BaseCheckBox = React.forwardRef<HTMLInputElement, Omit<Props, 'name'>>(
  ({ label, value, onChange, children, ...rest }, ref) => {
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
          />
        </label>

        {children}
      </div>
    )
  },
)

export const MCheckbox = React.forwardRef<HTMLInputElement, Props>(
  ({ name, onChange: _onChange, value: _value = false, ...rest }, _ref) => {
    const formCtx = useFormContext()

    if (formCtx === null) return <BaseCheckBox {...rest} ref={_ref} onChange={_onChange} value={_value} />

    return (
      <Controller
        name={name}
        control={formCtx.control}
        render={({ field: { onChange, ref, value = false, onBlur }, fieldState: { error } }) => {
          return (
            <BaseCheckBox {...rest} onBlur={onBlur} ref={mergeRefs([ref, _ref])} onChange={onChange} value={value}>
              <label className="label">
                {error !== undefined && <span className="label-text-alt"> {error.message} </span>}
              </label>
            </BaseCheckBox>
          )
        }}
      />
    )
  },
)

MCheckbox.displayName = 'MCheckbox'
