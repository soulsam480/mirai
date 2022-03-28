import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  size?: string
  thickness?: string | number
}

const MSpinner: React.FC<Props> = ({ className, size, thickness }) => {
  return (
    <svg
      viewBox="25 25 50 50"
      className={clsx(['j-spinner', className ?? '', 'text-primary'])}
      height={size}
      width={size}
    >
      <circle
        className="j-spinner__path"
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth={thickness}
        strokeMiterlimit="10"
      />
    </svg>
  )
}

MSpinner.defaultProps = {
  size: '30px',
  thickness: 5,
}

export default MSpinner
