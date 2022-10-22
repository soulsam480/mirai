import React, { useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from '@headlessui/react'
import clsx from 'clsx'
import IconPhInfo from '~icons/ph/info'
import IconPhCheckCircle from '~icons/ph/check-circle'
import IconPhWarningCircle from '~icons/ph/warning-circle'
import IconPhSkull from '~icons/ph/skull'
import { useAtomValue } from 'jotai'
import { Alert, alertsSubAtom } from './store'
import { useMounted } from '../../utils'

export const MAlert: React.FC<Alert> = React.memo(({ type, message }) => {
  const bgColor = useMemo(() => {
    switch (type) {
      case 'success':
        return 'alert-success'

      case 'warning':
        return 'alert-warning'

      case 'danger':
        return 'alert-error'

      default:
        return 'alert-info'
    }
  }, [type])

  const iconName = useMemo(() => {
    switch (type) {
      case 'success':
        return <IconPhCheckCircle />

      case 'warning':
        return <IconPhWarningCircle />

      case 'danger':
        return <IconPhSkull />

      default:
        return <IconPhInfo />
    }
  }, [type])

  return (
    <div className={clsx(['alert p-2 text-base shadow', bgColor])}>
      <div className="flex items-center space-x-2">
        {iconName}
        <span className="font-semibold">{message}</span>
      </div>
    </div>
  )
})

MAlert.displayName = 'MAlert'

interface AlertGroupProps {}

export const MAlertGroup: React.FC<AlertGroupProps> = () => {
  const alerts = useAtomValue(alertsSubAtom)
  const mounted = useMounted()

  return mounted
    ? createPortal(
        <div className="list-group fixed top-0 left-1/2 z-50 -translate-x-1/2 transform">
          <Transition is="div" className="flex flex-col items-center justify-center" show={!(alerts.length === 0)}>
            {alerts.map((alert) => (
              <Transition.Child
                key={alert.id}
                enter="j-alert--enter"
                leave="j-alert--leave"
                enterTo="j-alert--enter-active"
                leaveFrom="j-alert--leave-active"
                className="j-alert"
              >
                <MAlert {...alert} />
              </Transition.Child>
            ))}
          </Transition>
        </div>,
        document.getElementById('__next') as HTMLDivElement,
      )
    : null
}

MAlertGroup.displayName = 'MAlertGroup'
