import React, { HTMLProps } from 'react'
import { FormProvider, FormProviderProps } from 'react-hook-form'
import { OverWrite } from 'types'

interface Props
  extends OverWrite<HTMLProps<HTMLFormElement>, { form: Omit<FormProviderProps<any, any>, 'children'> }> {}

export const MForm = React.forwardRef<HTMLFormElement, Props>(({ form, children, ...rest }, ref) => {
  return (
    <FormProvider {...form}>
      <form {...rest} ref={ref}>
        {children}
      </form>
    </FormProvider>
  )
})
