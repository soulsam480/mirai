import React, { HTMLProps } from 'react'
import { FieldError } from 'react-hook-form'
import clsx from 'clsx'

interface Props extends HTMLProps<HTMLInputElement> {
  error?: FieldError
  label: string
  as?: 'input' | 'textarea'
}

export const MInput = React.forwardRef<HTMLInputElement, Props>(({ error, label, as = 'input', ...rest }, ref) => {
  const RenderInput = as

  return (
    <div className="flex flex-col">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <RenderInput
        className={clsx([
          as === 'input'
            ? 'input input-bordered input-primary input-sm'
            : 'textarea textarea-bordered textarea-primary',
          rest.className,
        ])}
        {...rest}
        // @ts-expect-error bad types
        ref={ref}
      />
      <label className="label">{error != null && <span className="label-text-alt"> {error.message} </span>} </label>
    </div>
  )
})
