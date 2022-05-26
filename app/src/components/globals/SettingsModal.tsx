import clsx from 'clsx'
import { MIcon } from 'components/lib/MIcon'
import React from 'react'
import { eventBus } from 'utils/helpers'
import { useTheme } from 'utils/hooks'

interface Props {
  onClose: (val: boolean) => void
}

export const SettingsModal: React.FC<Props> = ({ onClose }) => {
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex min-h-[600px] flex-col gap-2 text-left sm:w-[700px] sm:max-w-[700px]">
      <div className="flex items-center justify-between text-lg">
        <div>Settings</div>

        <button className="btn btn-ghost btn-circle btn-sm" onClick={() => onClose(false)}>
          <MIcon>
            <IconLaTimesCircle />
          </MIcon>
        </button>
      </div>

      <div className="text-base">Appearance</div>

      <div className="flex items-center justify-between gap-2">
        <div className="text-xs">Customize how Mirai looks on your device.</div>

        <button
          className="btn btn-ghost btn-xs flex items-center gap-2"
          onClick={() => {
            setTheme(theme === 'dark' ? 'corporate' : 'dark')
          }}
        >
          <label className={clsx(['swap-rotate swap flex-none', theme === 'light' && 'swap-active'])}>
            <MIcon className="swap-on">
              <IconLaSun />
            </MIcon>

            <MIcon className="swap-off">
              <IconLaMoon />
            </MIcon>
          </label>

          <div className="text-xs">switch to {theme === 'light' ? 'Dark' : 'Light'} </div>
        </button>
      </div>

      <div className="text-base">Platform</div>

      <div className="flex items-center justify-between gap-2">
        <div className="text-xs">Interactive tour</div>

        <button
          className="btn btn-ghost btn-xs flex items-center gap-2"
          onClick={() => {
            onClose(false)
            eventBus.emit('toggle-tour')
          }}
        >
          Show tour
        </button>
      </div>
    </div>
  )
}
