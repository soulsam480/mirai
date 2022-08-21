import { Combobox, Portal } from '@headlessui/react'
import clsx from 'clsx'
import React, { ReactElement, useMemo, useState } from 'react'
import { Control, FieldError, useController, useFormContext } from 'react-hook-form'
import { Option } from '../../types'
import { isSafeVal } from '../../utils'
import { MIcon } from './MIcon'
import { useSelectPopperConfig } from './MSelect'

interface RenderPropCtx {
  active: boolean
  selected: boolean
  disabled: boolean
}

export interface MSearchProps {
  name: string
  label: string
  options: Option[]
  error?: FieldError
  optionSlot?: (ctx: { option: Option; slotCtx: RenderPropCtx }) => ReactElement
  noDataLabel?: React.ReactNode
  control?: Control<any, any>
  displayValue?: (option?: Option) => string
  placeholder?: string
  disabled?: boolean
  reset?: boolean
  width?: string
}

export const MSearch: React.FC<MSearchProps> = ({
  name,
  control,
  error: _error,
  displayValue = (option) => option?.label ?? '',
  label,
  noDataLabel,
  options,
  optionSlot,
  placeholder,
  disabled,
  reset = false,
  width,
}) => {
  const formCtx = useFormContext()
  const _control = formCtx !== null ? formCtx.control : control

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control: _control,
  })

  const fieldError = _error ?? error
  const [query, setQuery] = useState('')

  const filteredOptions = useMemo(
    () =>
      query === ''
        ? options
        : options.filter((option) =>
            option.label.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, '')),
          ),
    [query, options],
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function extractOption(val: any) {
    const selectedOption = options.find((v) => v.value === (isSafeVal(val) ? val : val.value ?? ''))

    return selectedOption
  }

  function isValue(val: null | string | undefined) {
    return !(val === undefined || val === null || val === '')
  }

  const optionFromValue = useMemo(() => {
    if (!isValue(value)) return ''

    const selectedOption = extractOption(value)

    if (selectedOption !== undefined) return selectedOption

    if (isSafeVal(value)) return value

    return 'Unknown value'
  }, [value, extractOption])

  const [trigger, container] = useSelectPopperConfig(width)

  return (
    <div className="flex min-w-[200px] flex-col">
      <label className="label">
        <span className="label-text"> {label} </span>
      </label>

      <Combobox
        value={value}
        onChange={(option) => {
          setQuery('')
          onChange(option.value)
        }}
        disabled={disabled}
      >
        <div className="relative flex">
          <div className="relative flex w-full items-center">
            <Combobox.Input
              className="input input-bordered input-primary input-sm flex-grow"
              displayValue={(val) => displayValue(extractOption(val))}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              autoCorrect="off"
              aria-autocomplete="none"
              placeholder={placeholder}
              ref={trigger}
            />

            <Combobox.Button className="absolute right-0 top-[0.25] bottom-[0.25] float-none mr-2 flex items-center bg-base-100">
              {({ open, disabled }) => {
                return (
                  <div className="relative flex items-center">
                    {reset && !disabled && isValue(value) && (
                      <MIcon
                        className={clsx([
                          'tooltip tooltip-left tooltip-secondary p-1',
                          disabled && 'bg-base-200 text-base-300',
                        ])}
                        onClick={(e) => {
                          e.stopPropagation()

                          onChange('')
                        }}
                        data-tip="Reset value"
                      >
                        <IconPhArrowCounterClockwise />
                      </MIcon>
                    )}

                    <MIcon
                      className={clsx([
                        'transition-all duration-300',
                        open && '-rotate-180',
                        disabled && 'bg-base-200 text-base-300',
                      ])}
                    >
                      <IconPhCaretDown />
                    </MIcon>
                  </div>
                )
              }}
            </Combobox.Button>
          </div>

          <Portal>
            <Combobox.Options className="m-select__options" style={{ width: width ?? 'auto' }} ref={container}>
              {filteredOptions.length === 0 && query !== '' ? (
                <Combobox.Option
                  value={''}
                  className="flex cursor-not-allowed items-center space-x-2 rounded-sm px-3 py-[6px] text-left font-medium"
                  disabled
                >
                  <IconPhWarningCircle className="text-error " /> <span> {noDataLabel ?? 'No options'} </span>
                </Combobox.Option>
              ) : (
                filteredOptions.map((option, i) => {
                  const selected =
                    (isSafeVal(optionFromValue) ? optionFromValue : optionFromValue.value) === option.value

                  return (
                    <Combobox.Option
                      key={i}
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
                              selected ? 'font-semibold text-primary group-hover:text-base-100' : '',
                              'flex-grow',
                            ])}
                          >
                            {option.label}
                          </span>
                        )
                      }
                    </Combobox.Option>
                  )
                })
              )}
            </Combobox.Options>
          </Portal>
        </div>
      </Combobox>

      <label className="label">
        {fieldError !== undefined && <span className="label-text-alt"> {fieldError.message} </span>}{' '}
      </label>
    </div>
  )
}
