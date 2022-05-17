import React from 'react'
import { MDialog } from './MDialog'
import { MIcon } from './MIcon'

interface Props {
  label: React.ReactNode
  show: boolean
  onConfirm: () => void
  onReject?: () => void
}

export const MAlertDialog: React.FC<Props> = ({ label, onConfirm, onReject, show }) => {
  return (
    <MDialog
      show={show}
      onClose={() => {
        onReject?.()
      }}
    >
      <div className="flex flex-col gap-5">
        <div className="text-md">{label}</div>

        <div className="flex items-center justify-end gap-4">
          <button className="   btn btn-outline btn-sm items-center gap-1" onClick={onReject}>
            <MIcon>
              <IconLaCheckCircleSolid />
            </MIcon>

            <span>Cancel</span>
          </button>

          <button className="btn btn-error btn-sm items-center gap-1" onClick={onConfirm}>
            <MIcon>
              <IconLaExclamationCircle />
            </MIcon>

            <span>Continue</span>
          </button>
        </div>
      </div>
    </MDialog>
  )
}
