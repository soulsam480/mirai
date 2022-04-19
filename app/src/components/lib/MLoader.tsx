import React from 'react'
import { createPortal } from 'react-dom'
import MSpinner from 'lib/MSpinner'
import { useAtomValue } from 'jotai'
import { loaderAtom } from 'lib/store/loader'

interface Props {}

export const MLoader: React.FC<Props> = () => {
  const isLoader = useAtomValue(loaderAtom)

  return createPortal(
    <>
      {isLoader === true && (
        <div id="loader-root" className="absolute inset-0 z-[10000] flex items-center justify-center bg-base-200">
          <MSpinner size="100px" thickness={4} />
        </div>
      )}
    </>,
    document.getElementById('__next') as HTMLDivElement,
  )
}

MLoader.displayName = 'MLoader'
