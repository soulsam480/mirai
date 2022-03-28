import { Listbox, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment, ReactElement, useMemo } from 'react'
import { FieldError, useController, useFormContext } from 'react-hook-form'
import { isSafeVal } from 'utils/helpers'

export interface Option {
  label: string
  value: any
  meta?: any
}

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
}

export const MSelect: React.FC<MSelectProps> = ({ name, label, options = [], optionSlot, error, noDataLabel }) => {
  const { control } = useFormContext()
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
  })

  const optionFromValue = useMemo(() => {
    if (value === undefined) return 'Select'

    const selectedOption = options.find((v) => v.value === (isSafeVal(value) === true ? value : value.value ?? ''))

    if (selectedOption !== undefined) return selectedOption

    if (isSafeVal(value) === true) return value

    return 'Unknown value'
  }, [value, options])

  return (
    <div className="flex flex-col">
      <label className="label">
        <span className="label-text"> {label} </span>
      </label>

      <Listbox value={value} onChange={(option) => onChange(option.value)}>
        <div className="relative flex">
          <Listbox.Button className="m-select__btn">
            {isSafeVal(optionFromValue) === true ? optionFromValue : optionFromValue.label}
          </Listbox.Button>

          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="m-select__options">
              {options.length > 0 ? (
                options.map((option) => (
                  <Listbox.Option
                    key={option.label}
                    value={option}
                    className={({ active }) =>
                      clsx(['px-3 py-[6px] text-left rounded-sm cursor-pointer', active && 'bg-amber-200'])
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
        {error !== undefined && <span className="label-text-alt"> {error.message} </span>}{' '}
      </label>
    </div>
  )
}
