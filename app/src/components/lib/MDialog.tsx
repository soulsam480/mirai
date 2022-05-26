import { Dialog, Transition } from '@headlessui/react'
import clsx from 'clsx'
import React, { Fragment } from 'react'

export interface Props {
  show: boolean
  onClose: (val: boolean) => void
  children: React.ReactChild
  noEscape?: boolean
  className?: string
  afterLeave?: () => void
}

interface ContentProps {
  children: React.ReactChild
  className?: string
}

const DialogContent = React.forwardRef<HTMLDivElement, ContentProps>(({ children, className }, ref) => {
  return (
    <div className={clsx(['dialog-content', className ?? '', 'bg-base-200'])} ref={ref}>
      {React.isValidElement(children)
        ? React.cloneElement(children, {
            ...children.props,
            className: clsx([children.props.className ?? '', 'max-h-full']),
          })
        : null}
    </div>
  )
})

export const MDialog: React.FC<Props> = ({ show, children, onClose, noEscape, className, afterLeave }) => {
  return (
    <Transition appear unmount show={show} as={Fragment} static={noEscape} afterLeave={afterLeave}>
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
          <DialogContent className={className}>{children}</DialogContent>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

MDialog.displayName = 'MDialog'
