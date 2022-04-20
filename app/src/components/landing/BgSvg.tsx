import React from 'react'

interface Props {}

export const BgSvg: React.FC<Props> = () => {
  return (
    <svg
      className="h-auto w-full rotate-180 fill-primary"
      width="1600"
      height="720"
      viewBox="0 0 1600 720"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 338L53.3 349.2C106.7 360.3 213.3 382.7 320 393.8C426.7 405 533.3 405 640 359.3C746.7 313.7 853.3 222.3 960 189.2C1066.7 156 1173.3 181 1280 159.2C1386.7 137.3 1493.3 68.7 1546.7 34.3L1600 0V720H1546.7C1493.3 720 1386.7 720 1280 720C1173.3 720 1066.7 720 960 720C853.3 720 746.7 720 640 720C533.3 720 426.7 720 320 720C213.3 720 106.7 720 53.3 720H0V338Z"></path>
    </svg>
  )
}
