import { Listbox, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment, ReactElement, useMemo } from 'react'
import { Control, FieldError, useController, useFormContext } from 'react-hook-form'
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
  label: string
  options: Option[]
  error?: FieldError
  optionSlot?: (ctx: { option: Option; slotCtx: RenderPropCtx }) => ReactElement
  noDataLabel?: React.ReactNode
  control?: Control<any, any>
  disabled?: boolean
  reset?: boolean
}

export const MSelect: React.FC<MSelectProps> = ({
  name,
  label,
  options = [],
  optionSlot,
  error: _error,
  noDataLabel,
  control,
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

  function isValue(val: null | string | undefined) {
    return !(val === undefined || val === null || val === '')
  }

  const optionFromValue = useMemo(() => {
    if (!isValue(value)) return 'Select'

    const selectedOption = options.find((v) => v.value === (isSafeVal(value) === true ? value : value.value ?? ''))

    if (selectedOption !== undefined) return selectedOption

    if (isSafeVal(value) === true) return value

    return 'Unknown value'
  }, [value, options])

  const fieldError = _error ?? error

  return (
    <div className="flex flex-col">
      <label className="label">
        <span className="label-text"> {label} </span>
      </label>

      <Listbox value={value} onChange={(option) => onChange(option.value)} disabled={disabled}>
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
                        'absolute right-[30px] p-1 z-10 tooltip tooltip-secondary tooltip-left',
                        disabled && 'text-base-300',
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
                      'transition-all duration-300 flex-none',
                      open && '-rotate-180',
                      disabled && 'text-base-300',
                    ])}
                  >
                    <IconLaChevronDown />
                  </MIcon>
                </>
              )
            }}
          </Listbox.Button>

          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="m-select__options">
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
                    </Listbox.Option>
                  )
                })
              ) : (
                <Listbox.Option
                  value={''}
                  className="px-3 flex space-x-2 items-center font-medium py-[6px] text-left rounded-sm cursor-not-allowed"
                  disabled
                >
                  <IconLaExclamationCircle className="text-error " /> <span> {noDataLabel ?? 'No options'} </span>
                </Listbox.Option>
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      <label className="label">
        {fieldError !== undefined && <span className="label-text-alt"> {fieldError.message} </span>}{' '}
      </label>
    </div>
  )
}

MSelect.displayName = 'MSelect'
