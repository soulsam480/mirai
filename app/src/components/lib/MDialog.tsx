import { Dialog, Transition } from '@headlessui/react'
import clsx from 'clsx'
import React, { Fragment } from 'react'

export interface Props {
  show: boolean
  onClose: (val: boolean) => void
  children: React.ReactChild
  noEscape?: boolean
}

interface ContentProps {
  children: React.ReactChild
}

const DialogContent = React.forwardRef<HTMLDivElement, ContentProps>(({ children }, ref) => {
  return (
    <div className="dialog-content" ref={ref}>
      {React.isValidElement(children)
        ? React.cloneElement(children, {
            ...children.props,
            className: clsx([children.props.className ?? '', 'max-h-full']),
          })
        : null}
    </div>
  )
})

export const MDialog: React.FC<Props> = ({ show, children, onClose, noEscape }) => {
  return (
    <Transition appear show={show} as={Fragment} static={noEscape}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 flex max-h-screen items-center justify-center overflow-y-hidden"
        onClose={onClose}
        static={noEscape}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-base-100" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <DialogContent>{children}</DialogContent>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

MDialog.displayName = 'MDialog'
