import { Listbox, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment, ReactElement, useMemo } from 'react'
import { Control, Controller, FieldError, useFormContext } from 'react-hook-form'
import type { Option } from 'types'
import { isSafeVal } from 'utils/helpers'
import { MIcon } from './MIcon'

interface RenderPropCtx {
  active: boolean
  selected: boolean
  disabled: boolean
}

export interface MSelectProps {
  name: string
  label?: string
  options: Option[]
  error?: FieldError
  optionSlot?: (ctx: { option: Option; slotCtx: RenderPropCtx }) => ReactElement
  noDataLabel?: React.ReactNode
  control?: Control<any, any>
  disabled?: boolean
  reset?: boolean
  onChange?: (value: any) => void
  value?: any
  palceholder?: string
  width?: string
}

const BaseSelect: React.FC<Omit<MSelectProps, 'name'>> = ({
  label,
  options = [],
  optionSlot,
  noDataLabel,
  disabled,
  reset = false,
  value,
  onChange,
  palceholder,
  children,
  width,
}) => {
  function isValue(val: null | string | undefined) {
    return !(val === undefined || val === null || val === '')
  }

  const optionFromValue = useMemo(() => {
    if (!isValue(value)) return palceholder ?? 'Select'

    const selectedOption = options.find((v) => v.value === (isSafeVal(value) === true ? value : value.value ?? ''))

    if (selectedOption !== undefined) return selectedOption

    if (isSafeVal(value) === true) return value

    return 'Unknown value'
  }, [value, options, palceholder])

  return (
    <div className="flex flex-col">
      {label !== undefined && (
        <label className="label">
          <span className="label-text"> {label} </span>
        </label>
      )}

      <Listbox value={value} onChange={(option) => onChange?.(option.value)} disabled={disabled}>
        <div className="relative flex">
          <Listbox.Button className="m-select__btn">
            {({ open, disabled }) => {
              return (
                <>
                  <span className="flex-grow">
                    {isSafeVal(optionFromValue) === true ? optionFromValue : optionFromValue.label}
                  </span>

                  {reset && !disabled && isValue(value) && (
                    <MIcon
                      className={clsx([
                        'tooltip tooltip-left tooltip-secondary',
                        disabled ? 'bg-base-200 text-base-300' : 'bg-base-100',
                      ])}
                      onClick={(e) => {
                        e.stopPropagation()

                        onChange?.(undefined)
                      }}
                      data-tip="Reset value"
                    >
                      <IconLaUndoAlt />
                    </MIcon>
                  )}

                  <MIcon
                    className={clsx([
                      'flex-none transition-all duration-300',
                      open && '-rotate-180',
                      disabled && 'bg-base-200 text-base-300',
                    ])}
                  >
                    <IconLaChevronDown />
                  </MIcon>
                </>
              )
            }}
          </Listbox.Button>

          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="m-select__options" style={{ width: width ?? '100%' }}>
              {options.length > 0 ? (
                options.map((option) => {
                  const selected =
                    (isSafeVal(optionFromValue) === true ? optionFromValue : optionFromValue.value) === option.value

                  return (
                    <Listbox.Option
                      key={option.label}
                      value={option}
                      className={({ active }) =>
                        clsx([
                          'group flex cursor-pointer items-center gap-2 break-words rounded-sm px-3 py-[6px] text-left',
                          active && 'bg-accent',
                        ])
                      }
                    >
                      {(slotCtx) =>
                        optionSlot?.({ option, slotCtx: { ...slotCtx, selected } }) ?? (
                          <span
                            className={clsx([
                              selected ? 'font-semibold text-primary group-hover:text-base-100' : 'text-base-content',
                              'flex-grow',
                            ])}
                          >
                            {option.label}
                          </span>
                        )
                      }
                    </Listbox.Option>
                  )
                })
              ) : (
                <Listbox.Option
                  value={''}
                  className="flex cursor-not-allowed items-center space-x-2 rounded-sm px-3 py-[6px] text-left font-medium"
                  disabled
                >
                  <IconLaExclamationCircle className="text-error " /> <span> {noDataLabel ?? 'No options'} </span>
                </Listbox.Option>
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {children}
    </div>
  )
}

export const MSelect: React.FC<MSelectProps> = ({
  name,
  error: _error,
  control,
  value: _value,
  onChange: _onChange,
  ...rest
}) => {
  const formCtx = useFormContext()

  if (formCtx === null && control === undefined) return <BaseSelect onChange={_onChange} value={_value} {...rest} />

  return (
    <Controller
      name={name}
      control={control ?? formCtx?.control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const fieldError = _error ?? error

        return (
          <BaseSelect onChange={onChange} value={value} {...rest}>
            <label className="label">
              {fieldError !== undefined && <span className="label-text-alt"> {fieldError.message} </span>}
            </label>
          </BaseSelect>
        )
      }}
    />
  )
}

MSelect.displayName = 'MSelect'
