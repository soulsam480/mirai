import React, { HTMLProps } from 'react'
import { FieldError } from 'react-hook-form'
import clsx from 'clsx'

interface Props extends HTMLProps<HTMLInputElement> {
  error?: FieldError
  label: string
  as?: 'input' | 'textarea'
}

export const MInput = React.forwardRef<HTMLInputElement, Props>(
  ({ error, label, as: RenderInput = 'input', ...rest }, ref) => {
    return (
      <div className="flex flex-col">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <RenderInput
          className={clsx([
            RenderInput === 'input'
              ? 'input-bordered input-primary input input-sm'
              : 'textarea-bordered textarea-primary textarea',
            rest.className,
          ])}
          {...rest}
          // @ts-expect-error bad types
          ref={ref}
        />
        <label className="label">
          {error !== undefined && error !== null && <span className="label-text-alt"> {error.message} </span>}{' '}
        </label>
      </div>
    )
  },
)

MInput.displayName = 'MInput'
