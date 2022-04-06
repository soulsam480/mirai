import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'

interface Props {
  show: boolean
  onClose: (val: boolean) => void
}

const DialogContent = React.forwardRef<HTMLDivElement, any>(({ children }, ref) => {
  return (
    <div className="dialog-content" ref={ref}>
      {children}
    </div>
  )
})

export const MDialog: React.FC<Props> = ({ show, children, onClose }) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-amber-100" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

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
        </div>
      </Dialog>
    </Transition>
  )
}
