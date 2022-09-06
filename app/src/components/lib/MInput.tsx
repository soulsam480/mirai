import React, { HTMLProps, PropsWithoutRef, useCallback } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import clsx from 'clsx'
import { forwardRefWithAs, mergeRefs } from '../../utils/helpers'
import { OverWrite } from '../../types'

type InputType = 'input' | 'textarea'

interface Props<
  T extends InputType = InputType,
  K = T extends 'input' ? HTMLInputElement : HTMLTextAreaElement,
> extends OverWrite<
    PropsWithoutRef<HTMLProps<K>>,
    {
      label: string
      as?: T
      hint?: string
      forwardedRef?: React.Ref<K>
      name: string
    }
  > {}

const BaseInput: React.FC<Props> = ({
  label,
  as: RenderInput = 'input',
  className,
  forwardedRef,
  children,
  ...rest
}) => {
  return (
    <div className="flex flex-col">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>

      <RenderInput
        {...rest}
        className={clsx([
          RenderInput === 'input'
            ? 'input input-bordered input-primary input-sm'
            : 'textarea textarea-bordered textarea-primary',
          className,
        ])}
        ref={forwardedRef as any}
      />

      {children}
    </div>
  )
}

export const MInput = forwardRefWithAs(
  <U extends InputType = InputType, K = React.Ref<U extends 'input' ? HTMLInputElement : HTMLTextAreaElement>>(
    { name, value: _value, onChange: _onChange, hint, ...rest }: Props<U>,
    ref: K,
  ) => {
    const formCtx = useFormContext()

    if (formCtx === null)
      return (
        <BaseInput name={name} value={_value ?? ''} onChange={_onChange} {...rest} forwardedRef={ref as any}>
          {<label className="label">{hint !== undefined && <span className="label-text-alt"> {hint} </span>}</label>}
        </BaseInput>
      )

    return (
      <Controller
        name={name}
        control={formCtx?.control}
        render={({ field: { onChange, value, ...fieldRest }, fieldState: { error } }) => {
          const handleBlur = useCallback(
            (e) => {
              fieldRest.onBlur()
              rest.onBlur?.(e)
            },
            [fieldRest],
          )

          return (
            <BaseInput
              onChange={onChange}
              value={value ?? ''}
              {...rest}
              name={name}
              onBlur={handleBlur}
              forwardedRef={mergeRefs([ref as any, fieldRest.ref])}
            >
              <label className="label">
                {(hint !== undefined || (error !== undefined && error !== null)) && (
                  <span className="label-text-alt"> {error?.message ?? hint} </span>
                )}
              </label>
            </BaseInput>
          )
        }}
      />
    )
  },
)

MInput.displayName = 'MInput'
