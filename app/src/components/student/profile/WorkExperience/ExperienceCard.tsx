import type { StudentWorkExperience } from '@prisma/client'
import React, { useState } from 'react'
import { useExperience } from '../../../../contexts'
import { formatDate } from '../../../../utils'
import { MAlertDialog, MFeatureCard, MIcon } from '../../../lib'

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
            <IconPhBuildings />
          </MIcon>
          <span className="text-lg">{experience.title}</span>
        </div>

        <div className="flex items-center gap-2 ">
          <MIcon className="text-sm">
            <IconPhAt />
          </MIcon>
          <span className="text-sm">
            {experience.company} <span className="mx-0.5">.</span> {experience.jobType}{' '}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <MIcon className="text-sm">
              <IconPhCalendar />
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
                  <IconPhMoney />
                </MIcon>
                <span className="text-xs">{experience.stipend}</span>
              </div>
            </>
          )}
        </div>
      </MFeatureCard.Body>

      <MFeatureCard.Footer>
        {/* // TODO: read only mode */}
        <button className="btn btn-ghost btn-xs items-center gap-1 text-base-content" onClick={() => onEdit()}>
          <MIcon>
            <IconPhPencilSimple />
          </MIcon>

          <span>Edit</span>
        </button>
        <button className="btn btn-ghost btn-xs items-center gap-1 text-error" onClick={() => setDeleteDialog(true)}>
          <MIcon>
            <IconPhTrash />
          </MIcon>

          <span>Delete</span>
        </button>
      </MFeatureCard.Footer>
    </MFeatureCard.Parent>
  )
})
