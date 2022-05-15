import React, { HTMLProps } from 'react'
import { FieldError } from 'react-hook-form'
import clsx from 'clsx'

interface Props extends HTMLProps<HTMLInputElement> {
  error?: FieldError
  label: string
  as?: 'input' | 'textarea'
  hint?: string
}

export const MInput = React.forwardRef<HTMLInputElement, Props>(
  ({ error, label, hint, as: RenderInput = 'input', ...rest }, ref) => {
    return (
      <div className="flex flex-col">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <RenderInput
          className={clsx([
            RenderInput === 'input'
              ? 'input input-bordered input-primary input-sm'
              : 'textarea textarea-bordered textarea-primary',
            rest.className,
          ])}
          {...rest}
          // @ts-expect-error bad types
          ref={ref}
        />
        <label className="label">
          {(hint !== undefined || (error !== undefined && error !== null)) && (
            <span className="label-text-alt"> {error?.message ?? hint} </span>
          )}
        </label>
      </div>
    )
  },
)

MInput.displayName = 'MInput'
