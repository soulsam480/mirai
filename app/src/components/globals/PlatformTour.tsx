import React, { useContext, useEffect } from 'react'
import { ShepherdOptionsWithType, ShepherdTour, ShepherdTourContext, Tour } from 'react-shepherd'
// import 'shepherd.js/dist/css/shepherd.css'

interface Props {
  assignRef: (tour: Tour | null) => void
}

const tourOptions: Tour.TourOptions = {
  defaultStepOptions: {
    attachTo: {
      on: 'bottom',
    },
    buttons: [
      {
        action() {
          this.back()
        },
        label: 'Previous',
        text: 'Previous',
        classes: 'btn btn-primary btn-sm',
      },
      {
        action() {
          this.next()
        },
        label: 'Next',
        text: 'Next',
        classes: 'btn btn-primary btn-sm',
      },
    ],
  },
  exitOnEsc: false,
  useModalOverlay: true,
}

const steps: ShepherdOptionsWithType[] = [
  {
    attachTo: { element: '#m-inst-departments', on: 'bottom' },
    text: ['Manage departments here !'],
  },
  {
    attachTo: { element: '#m-inst-courses', on: 'bottom' },
    text: ['Manage courses here !'],
  },
  {
    attachTo: { element: '#m-inst-batches', on: 'bottom' },
    text: ['Manage batches here !'],
  },
  {
    attachTo: { element: '#m-inst-students', on: 'bottom' },
    text: ['Manage students here !'],
  },
]

function TourInstance({ assignRef }: { assignRef: (tour: Tour | null) => void }) {
  const tour = useContext(ShepherdTourContext)

  useEffect(() => {
    if (tour !== null) {
      assignRef(tour)
    }
  }, [tour, assignRef])

  return <></>
}

const PlatformTour: React.FC<Props> = ({ assignRef }) => {
  return typeof window === 'undefined' ? null : (
    <ShepherdTour tourOptions={tourOptions} steps={steps}>
      <TourInstance assignRef={assignRef} />
    </ShepherdTour>
  )
}

export default PlatformTour
