import type { StudentWorkExperience } from '@prisma/client'
import { MAlertDialog } from 'components/lib/MAlertDialog'
import MFeatureCard from 'components/lib/MFeatureCard'
import { MIcon } from 'components/lib/MIcon'
import { useExperience } from 'contexts/student'
import React, { useState } from 'react'
import { formatDate } from 'utils/helpers'

interface Props {
  experience: StudentWorkExperience
  onEdit: (readOnly?: boolean) => void
}

export const ExperienceCard = React.memo<Props>(({ experience, onEdit }) => {
  const [isDeleteDialog, setDeleteDialog] = useState(false)

  const { deleteExperience } = useExperience()

  return (
    <MFeatureCard.Parent>
      <MAlertDialog
        label={
          <>
            Remove experience{' '}
            {experience.company?.length > 0 && <span className="font-semibold">{experience.company}</span>} ?
          </>
        }
        onConfirm={async () => {
          await deleteExperience(experience.id)

          setDeleteDialog(false)
        }}
        show={isDeleteDialog}
        onReject={() => setDeleteDialog(false)}
      />

      <MFeatureCard.Body>
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
      </MFeatureCard.Body>

      <MFeatureCard.Footer>
        {/* // TODO: read only mode */}
        <button className="items-center gap-1 text-base-content btn btn-link btn-xs" onClick={() => onEdit()}>
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
      </MFeatureCard.Footer>
    </MFeatureCard.Parent>
  )
})
