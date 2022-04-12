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

  const optionFromValue = useMemo(() => {
    if (value === undefined || value === '') return ''

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
          <div className="relative flex items-center w-full">
            <Combobox.Input
              className="flex-grow input input-bordered input-primary input-sm"
              displayValue={(val) => displayValue(extractOption(val))}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              autoCorrect="off"
              aria-autocomplete="none"
              placeholder={placeholder}
            />

            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center float-none pr-2">
              {({ open, disabled }) => {
                return (
                  <MIcon
                    className={clsx([
                      'transition-all duration-300',
                      open && '-rotate-180',
                      disabled && 'text-base-300',
                    ])}
                  >
                    <IconLaChevronDown />
                  </MIcon>
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
                  className="px-3 flex space-x-2 items-center font-medium py-[6px] text-left rounded-sm cursor-not-allowed"
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
                          'px-3 py-[6px] text-left rounded-sm cursor-pointer break-words flex items-center gap-2',
                          active && 'bg-amber-200',
                        ])
                      }
                    >
                      {(slotCtx) =>
                        optionSlot?.({ option, slotCtx: { ...slotCtx, selected } }) ?? (
                          <>
                            {selected && (
                              <MIcon className="text-amber-600">
                                <IconLaCheckDouble />
                              </MIcon>
                            )}
                            <span className={clsx([selected ? 'font-semibold text-amber-600' : '', 'flex-grow'])}>
                              {option.label}
                            </span>
                          </>
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
