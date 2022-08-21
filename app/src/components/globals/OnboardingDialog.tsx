import { MDialog } from '../../components/lib'
import React from 'react'

interface Props {
  onStart: () => void
  onDismiss: () => void
  show: boolean
}

export const OnboardingDialog: React.FC<Props> = ({ onDismiss, onStart, show }) => {
  return (
    <MDialog show={show} onClose={() => null}>
      <div className="flex w-full flex-col items-center gap-6 text-center sm:w-[400px]">
        <div className="text-2xl font-semibold">Hey there, nice to see you !!</div>
        <div className="text-base">
          Welcome to Mirai. To get started run through the tour of the platform or explore it by yourself.
        </div>

        <div className="flex items-center gap-2">
          <button className="btn btn-primary btn-sm" onClick={onStart}>
            Start the tour
          </button>

          <button className="btn btn-outline btn-primary btn-sm" onClick={onDismiss}>
            Nope, I&apos;ll explore
          </button>
        </div>
      </div>
    </MDialog>
  )
}
