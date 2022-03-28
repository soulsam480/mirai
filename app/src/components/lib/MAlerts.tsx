import React, { useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from '@headlessui/react'
import clsx from 'clsx'
import IconLaInfoCircle from '~icons/la/info-circle.jsx'
import IconLaCheckCircleSolid from '~icons/la/check-circle-solid.jsx'
import IconLaExclamationCircle from '~icons/la/exclamation-circle.jsx'
import IconLaWindowClose from '~icons/la/window-close.jsx'
import { Alert, alertsSubAtom } from 'components/lib/store/alerts'
import { useMounted } from 'utils/hooks'
import { useAtomValue } from 'jotai'

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
        return <IconLaCheckCircleSolid />

      case 'warning':
        return <IconLaExclamationCircle />

      case 'danger':
        return <IconLaWindowClose />

      default:
        return <IconLaInfoCircle />
    }
  }, [type])

  return (
    <div className={clsx(['alert shadow p-2 text-base', bgColor])}>
      <div className="flex items-center space-x-2">
        {iconName}
        <span>{message}</span>
      </div>
    </div>
  )
})

MAlert.displayName = 'JAlert'

interface AlertGroupProps {}

export const MAlertGroup: React.FC<AlertGroupProps> = () => {
  const alerts = useAtomValue(alertsSubAtom)
  const mounted = useMounted()

  return mounted
    ? createPortal(
        <div className="fixed top-0 z-50 transform -translate-x-1/2 left-1/2 list-group">
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
