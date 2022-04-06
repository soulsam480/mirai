import type { StudentWorkExperience } from '@prisma/client'
import { MIcon } from 'components/lib/MIcon'
import React from 'react'
import { formatDate } from 'utils/helpers'

interface Props {
  experience: StudentWorkExperience
  onClick?: () => void
}

export const ExperienceCard = React.memo<Props>(({ experience, onClick }) => {
  return (
    <div
      className="flex flex-col gap-1 p-2 transition-shadow duration-200 ease-in-out rounded-md cursor-pointer hover:shadow bg-amber-100"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 ">
        <MIcon className="text-base">
          <IconLaUserGraduate />
        </MIcon>
        <span className="text-lg">{experience.title}</span>
      </div>

      <div className="flex items-center gap-2 ">
        <MIcon className="text-sm">
          <IconLaBuilding />
        </MIcon>
        <span className="text-sm">
          {experience.company} <span className="mx-0.5">.</span> {experience.jobType}{' '}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <MIcon className="text-sm">
            <IconLaCalendar />
          </MIcon>
          <span className="text-xs">
            From {formatDate(experience.startedAt)} <span className="mx-0.5">to&nbsp;</span>
            {experience.isOngoing && experience.endedAt === null ? 'Present' : formatDate(experience.endedAt)}
          </span>
        </div>
        <span>.</span>
        <div className="flex items-center gap-2">
          <MIcon className="text-sm">
            <IconLaMoneyBill />
          </MIcon>
          <span className="text-xs">{experience.stipend}</span>
        </div>
      </div>
    </div>
  )
})
