import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import IconLaInfoCircle from '~icons/la/info-circle.jsx';
import IconLaCheckCircleSolid from '~icons/la/check-circle-solid.jsx';
import IconLaExclamationCircle from '~icons/la/exclamation-circle.jsx';
import IconLaWindowClose from '~icons/la/window-close.jsx';
import { Alert, useAlerts } from 'components/lib/store/alerts';
import { useMounted } from 'utils/hooks';

export const JAlert: React.FC<Alert> = ({ type, message }) => {
  const bgColor = useMemo(() => {
    switch (type) {
      case 'success':
        return 'alert-success';

      case 'warning':
        return 'alert-warning';

      case 'danger':
        return 'alert-error';

      default:
        return 'alert-info';
    }
  }, [type]);

  const iconName = useMemo(() => {
    switch (type) {
      case 'success':
        return <IconLaCheckCircleSolid />;

      case 'warning':
        return <IconLaExclamationCircle />;

      case 'danger':
        return <IconLaWindowClose />;

      default:
        return <IconLaInfoCircle />;
    }
  }, [type]);

  return (
    <div className={clsx(['alert shadow p-2 text-base', bgColor])}>
      <div className="flex items-center space-x-2">
        {iconName}
        <span>{message}</span>
      </div>
    </div>
  );
};

interface AlertGroupProps {}

export const JAlertGroup: React.FC<AlertGroupProps> = () => {
  const [alerts] = useAlerts();
  const mounted = useMounted();

  return mounted
    ? createPortal(
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 list-group z-50">
          <Transition is="div" className="flex flex-col justify-center items-center" show={!!alerts.length}>
            {alerts.map((alert) => (
              <Transition.Child
                key={alert.id}
                enter="j-alert--enter"
                leave="j-alert--leave"
                enterTo="j-alert--enter-active"
                leaveFrom="j-alert--leave-active"
                className="j-alert"
              >
                <JAlert {...alert} />
              </Transition.Child>
            ))}
          </Transition>
        </div>,
        document.getElementById('__next') as HTMLDivElement,
      )
    : null;
};