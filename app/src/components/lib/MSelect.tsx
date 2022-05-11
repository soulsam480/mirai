import { Listbox, Portal } from '@headlessui/react'
import clsx from 'clsx'
import { ReactElement, useMemo } from 'react'
import { Control, Controller, FieldError, useFormContext } from 'react-hook-form'
import type { Option } from 'types'
import { isSafeVal } from 'utils/helpers'
import { usePopper } from 'utils/hooks'
import { MIcon } from './MIcon'

interface OptionRenderPropCtx {
  active: boolean
  selected: boolean
  disabled: boolean
}

interface ButtonRenderPropCtx {
  open: boolean
  disabled: boolean
  /** notice here value is unsafe. add a runtime check for value type
   * e.g.
   * ```js
   *  function isValue(val: null | string | undefined) {
        return !(val === undefined || val === null || val === '')
      }
   * ```
   */
  value: any
}

export interface MSelectProps {
  name: string
  label?: string
  options: Option[]
  error?: FieldError
  optionSlot?: (ctx: { option: Option; slotCtx: OptionRenderPropCtx }) => ReactElement
  noDataLabel?: React.ReactNode
  control?: Control<any, any>
  disabled?: boolean
  reset?: boolean
  onChange?: (value: any) => void
  value?: any
  palceholder?: string
  width?: string
  borderless?: boolean
  customButton?: React.ReactNode | ((ctx: ButtonRenderPropCtx) => React.ReactNode)
}

export const useSelectPopperConfig = (width?: string) =>
  usePopper({
    placement: 'bottom-start',
    strategy: 'fixed',
    modifiers: [
      {
        name: 'sameWidth',
        enabled: width === undefined,
        phase: 'beforeWrite',
        fn({ state }) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          state.styles.popper.width = `${state.rects.reference.width}px`
        },
        requires: ['computeStyles'],
        effect: ({ state }) => {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          state.elements.popper.style.width = `${(state.elements.reference as unknown as any).clientWidth}px`
        },
      },
      { name: 'offset', options: { offset: [0, 10] } },
    ],
  })

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
  borderless = false,
  customButton,
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

  const [trigger, container] = useSelectPopperConfig(width)

  return (
    <div className="flex flex-col">
      {label !== undefined && (
        <label className="label">
          <span className="label-text"> {label} </span>
        </label>
      )}

      <Listbox value={value} onChange={(option) => onChange?.(option.value)} disabled={disabled}>
        <div className="relative flex">
          <Listbox.Button
            className={clsx([
              'm-select__btn',
              !borderless && 'm-select__btn--focus border border-primary',
              borderless && 'focus:outline-none',
            ])}
            ref={trigger}
          >
            {customButton !== undefined
              ? (ctx) =>
                  // more flexibility as a render prop
                  typeof customButton === 'function'
                    ? customButton({
                        ...ctx,
                        value: optionFromValue,
                      })
                    : // normal compoent
                      customButton
              : ({ open, disabled }) => {
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

          <Portal>
            <Listbox.Options className="m-select__options" style={{ width: width ?? 'auto' }} ref={container}>
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
          </Portal>
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
