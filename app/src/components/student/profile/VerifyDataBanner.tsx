import { useAtomValue } from 'jotai'
import React from 'react'
import { studentUnverifiedSectionAtom } from '../../../stores'
import IconPhInfo from '~icons/ph/info'
import clsx from 'clsx'
import { MIcon } from '../../lib'

interface Props {
  className?: string
}

export const VerifyDataBanner: React.FC<Props> = ({ className }) => {
  const unverifedSections = useAtomValue(studentUnverifiedSectionAtom)

  return (
    <div
      className={clsx([
        'alert mx-2 max-w-max !flex-col gap-1 rounded-md border border-warning bg-warning/20 p-2 text-sm shadow sm:text-base',
        className,
      ])}
    >
      <div className="flex items-center gap-2">
        <MIcon className="text-sm">
          <IconPhInfo />
        </MIcon>
        <span>
          It looks like you updated{' '}
          {unverifedSections.map(({ name }, i, arr) => (
            <>
              <span key={name} className="font-semibold">
                {name}
              </span>{' '}
              {i !== arr.length - 1 && ', '}
            </>
          ))}{' '}
          recently.
        </span>
      </div>

      <div className="flex w-full justify-end">
        <button className="btn-xs btn sm:btn-sm">Request verification</button>
      </div>
    </div>
  )
}
