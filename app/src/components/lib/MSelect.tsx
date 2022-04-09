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
}

export const MSelect: React.FC<MSelectProps> = ({
  name,
  label,
  options = [],
  optionSlot,
  error: _error,
  noDataLabel,
  control,
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

  const optionFromValue = useMemo(() => {
    if (value === undefined || value === '') return 'Select'

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

      <Listbox value={value} onChange={(option) => onChange(option.value)}>
        <div className="relative flex">
          <Listbox.Button className="m-select__btn">
            {({ open }) => {
              return (
                <>
                  <span className="flex-grow">
                    {isSafeVal(optionFromValue) === true ? optionFromValue : optionFromValue.label}
                  </span>

                  <MIcon className={clsx(['transition-all duration-300 flex-none', open && '-rotate-180'])}>
                    <IconLaChevronDown />
                  </MIcon>
                </>
              )
            }}
          </Listbox.Button>

          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="m-select__options">
              {options.length > 0 ? (
                options.map((option) => (
                  <Listbox.Option
                    key={option.label}
                    value={option}
                    className={({ active }) =>
                      clsx(['px-3 py-[6px] text-left rounded-sm cursor-pointer break-words', active && 'bg-amber-200'])
                    }
                  >
                    {(slotCtx) =>
                      optionSlot?.({ option, slotCtx: { ...slotCtx, selected: value.value === option.value } }) ?? (
                        <span
                          className={
                            (isSafeVal(optionFromValue) === true ? optionFromValue : optionFromValue.value) ===
                            option.value
                              ? 'text-amber-700'
                              : ''
                          }
                        >
                          {option.label}
                        </span>
                      )
                    }
                  </Listbox.Option>
                ))
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
