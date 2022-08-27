import React from 'react'
import { createPortal } from 'react-dom'
import { useAtomValue } from 'jotai'
import { loaderAtom } from './store'
import { MSpinner } from './MSpinner'

interface Props {}

export const MLoader: React.FC<Props> = () => {
  const isLoader = useAtomValue(loaderAtom)

  return createPortal(
    <>
      {isLoader && (
        <div id="loader-root" className="absolute inset-0 z-[10000] flex items-center justify-center bg-base-200">
          <MSpinner size="100px" thickness={4} />
        </div>
      )}
    </>,
    document.getElementById('__next') as HTMLDivElement,
  )
}

MLoader.displayName = 'MLoader'
