import { Combobox, Transition } from '@headlessui/react'
import clsx from 'clsx'
import React, { Fragment, ReactElement, useMemo, useState } from 'react'
import { Control, FieldError, useController, useFormContext } from 'react-hook-form'
import { Option } from 'types'
import { isSafeVal } from 'utils/helpers'
import { MIcon } from './MIcon'

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
    const selectedOption = options.find((v) => v.value === (isSafeVal(val) === true ? val : val.value ?? ''))

    return selectedOption
  }

  function isValue(val: null | string | undefined) {
    return !(val === undefined || val === null || val === '')
  }

  const optionFromValue = useMemo(() => {
    if (!isValue(value)) return ''

    const selectedOption = extractOption(value)

    if (selectedOption !== undefined) return selectedOption

    if (isSafeVal(value) === true) return value

    return 'Unknown value'
  }, [value, extractOption])

  return (
    <div className="flex flex-col">
      <label className="label">
        <span className="label-text"> {label} </span>
      </label>

      <Combobox value={value} onChange={(option) => onChange(option.value)} disabled={disabled}>
        <div className="relative flex">
          <div className="relative flex w-full items-center">
            <Combobox.Input
              className="input-bordered input-primary input input-sm flex-grow"
              displayValue={(val) => displayValue(extractOption(val))}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              autoCorrect="off"
              aria-autocomplete="none"
              placeholder={placeholder}
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
                        <IconLaUndoAlt />
                      </MIcon>
                    )}

                    <MIcon
                      className={clsx([
                        'transition-all duration-300',
                        open && '-rotate-180',
                        disabled && 'bg-base-200 text-base-300',
                      ])}
                    >
                      <IconLaChevronDown />
                    </MIcon>
                  </div>
                )
              }}
            </Combobox.Button>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options static className="m-select__options">
              {filteredOptions.length === 0 && query !== '' ? (
                <Combobox.Option
                  value={''}
                  className="flex cursor-not-allowed items-center space-x-2 rounded-sm px-3 py-[6px] text-left font-medium"
                  disabled
                >
                  <IconLaExclamationCircle className="text-error " /> <span> {noDataLabel ?? 'No options'} </span>
                </Combobox.Option>
              ) : (
                filteredOptions.map((option, i) => {
                  const selected =
                    (isSafeVal(optionFromValue) === true ? optionFromValue : optionFromValue.value) === option.value

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
          </Transition>
        </div>
      </Combobox>

      <label className="label">
        {fieldError !== undefined && <span className="label-text-alt"> {fieldError.message} </span>}{' '}
      </label>
    </div>
  )
}
