import type { StudentWorkExperience } from '@prisma/client'
import { MAlertDialog } from 'components/lib/MAlertDialog'
import { MIcon } from 'components/lib/MIcon'
import { useExperience } from 'contexts/student'
import React, { useState } from 'react'
import { formatDate } from 'utils/helpers'

interface Props {
  experience: StudentWorkExperience
  onEdit: () => void
}

export const ExperienceCard = React.memo<Props>(({ experience, onEdit }) => {
  const [isDeleteDialog, setDeleteDialog] = useState(false)

  const { deleteExperience } = useExperience()

  return (
    <div className="relative flex flex-col gap-1 p-2 transition-shadow duration-200 ease-in-out rounded-md hover:shadow bg-amber-100">
      <MAlertDialog
        label={
          <>
            Remove experience{' '}
            {experience.company?.length > 0 && <span className="font-semibold text-primary">{experience.company}</span>}{' '}
            ?
          </>
        }
        onConfirm={async () => {
          await deleteExperience(experience.id)

          setDeleteDialog(false)
        }}
        show={isDeleteDialog}
        onReject={() => setDeleteDialog(false)}
      />

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
            {formatDate(experience.startedAt)} <span className="mx-0.5">to&nbsp;</span>
            {experience.isOngoing && (experience.endedAt === null || experience.endedAt === undefined)
              ? 'Present'
              : formatDate(experience.endedAt)}
          </span>
        </div>

        {Boolean(experience.stipend) && (
          <>
            <span>.</span>

            <div className="flex items-center gap-2">
              <MIcon className="text-sm">
                <IconLaMoneyBill />
              </MIcon>
              <span className="text-xs">{experience.stipend}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button className="items-center gap-1 text-base-content btn btn-link btn-xs" onClick={onEdit}>
          <MIcon>
            <IconLaPenSquare />
          </MIcon>

          <span>Edit</span>
        </button>

        <button className="items-center gap-1 text-error btn btn-link btn-xs" onClick={() => setDeleteDialog(true)}>
          <MIcon>
            <IconLaTrashAltSolid />
          </MIcon>

          <span>Delete</span>
        </button>
      </div>
    </div>
  )
})
