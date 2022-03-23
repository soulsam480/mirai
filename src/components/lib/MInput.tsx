import React, { HTMLProps } from 'react'
import { FieldError } from 'react-hook-form'
import clsx from 'clsx'

interface Props extends HTMLProps<HTMLInputElement> {
  error?: FieldError
  label: string
}

export const MInput = React.forwardRef<HTMLInputElement, Props>(({ error, label, ...rest }, ref) => {
  return (
    <>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input className={clsx(['input input-bordered input-primary input-sm', rest.className])} {...rest} ref={ref} />
      <label className="label">{error != null && <span className="label-text-alt"> {error.message} </span>} </label>
    </>
  )
})
