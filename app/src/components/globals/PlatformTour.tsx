import type { Role } from '@prisma/client'
import React, { useContext, useEffect } from 'react'
import { ShepherdOptionsWithType, ShepherdTour, ShepherdTourContext, Tour } from 'react-shepherd'

interface Props {
  assignRef: (tour: Tour | null) => void
  role: Role
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

const steps: Record<Role, ShepherdOptionsWithType[]> = {
  INSTITUTE: [
    {
      attachTo: { element: '#m-inst-departments', on: 'bottom' },
      text: ['Manage departments here.'],
    },
    {
      attachTo: { element: '#m-inst-courses', on: 'bottom' },
      text: ['Manage courses here.'],
    },
    {
      attachTo: { element: '#m-inst-batches', on: 'bottom' },
      text: ['Manage batches here.'],
    },
    {
      attachTo: { element: '#m-inst-students', on: 'bottom' },
      text: ['Manage students here.'],
    },
    {
      attachTo: { element: '#m-inst-tickets', on: 'bottom' },
      text: ['Review and manage support tickets from students here.'],
    },
  ],
  STUDENT: [
    {
      attachTo: { element: '#m-stu-profile', on: 'bottom' },
      text: ['This is your profile. You can modify your profile to get better job offers.'],
    },
    {
      attachTo: { element: '#m-stu-applications', on: 'bottom' },
      text: ['View your job applications and more here.'],
    },
    {
      attachTo: { element: '#m-stu-opportunities', on: 'bottom' },
      text: ['Explore various offers that are available at your institute and on Mirai here.'],
    },
  ],
  ADMIN: [],
  INSTITUTE_MOD: [],
}

function TourInstance({ assignRef }: { assignRef: (tour: Tour | null) => void }) {
  const tour = useContext(ShepherdTourContext)

  useEffect(() => {
    if (tour !== null) {
      assignRef(tour)
    }
  }, [tour, assignRef])

  return <></>
}

const PlatformTour: React.FC<Props> = ({ assignRef, role }) => {
  return typeof window === 'undefined' ? null : (
    <ShepherdTour tourOptions={tourOptions} steps={steps[role]}>
      <TourInstance assignRef={assignRef} />
    </ShepherdTour>
  )
}

export default PlatformTour
