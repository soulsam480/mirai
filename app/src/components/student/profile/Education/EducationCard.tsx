import { StudentEducation } from '@prisma/client'
import { MAlertDialog } from 'components/lib/MAlertDialog'
import MFeatureCard from 'components/lib/MFeatureCard'
import { MIcon } from 'components/lib/MIcon'
import { useEducation } from 'contexts/student/education'
import React, { useState } from 'react'
import { formatDate } from 'utils/helpers'

interface Props {
  education: StudentEducation
  onEdit: (readonly?: boolean) => void
}

export const EducationCard = React.memo<Props>(({ education, onEdit }) => {
  const [isDeleteDialog, setDeleteDialog] = useState(false)

  const { deleteEducation } = useEducation()

  return (
    <MFeatureCard.Parent>
      <MAlertDialog
        label={
          <>
            Remove education <span className="font-semibold">{education.school}</span> ?
          </>
        }
        onConfirm={async () => {
          await deleteEducation(education.id)

          setDeleteDialog(false)
        }}
        show={isDeleteDialog}
        onReject={setDeleteDialog}
      />

      <MFeatureCard.Body>
        <div className="flex items-center gap-2 ">
          <MIcon className="text-base">
            <IconLaHotel />
          </MIcon>

          <span className="text-lg">{education.school}</span>
        </div>

        <div className="flex items-center gap-2 ">
          <MIcon className="text-sm">
            <IconLaGraduationCap />
          </MIcon>

          <span className="text-sm">
            {education.program}({education.board})
          </span>

          <span>.</span>

          <span className="text-sm">{education.type}</span>
        </div>

        <div className="flex items-center gap-2">
          <MIcon className="text-sm">
            <IconLaCalendar />
          </MIcon>

          <span className="text-xs">
            {formatDate(education.startedAt)} <span className="mx-0.5">to&nbsp;</span>
            {education.isOngoing && (education.endedAt === null || education.endedAt === undefined)
              ? 'Present'
              : formatDate(education.endedAt)}
          </span>
        </div>
      </MFeatureCard.Body>

      <MFeatureCard.Footer>
        {/* // TODO: readonly mode */}
        <button className="btn btn-link btn-xs items-center gap-1 text-base-content" onClick={() => onEdit()}>
          <MIcon>
            <IconLaPenSquare />
          </MIcon>

          <span>Edit</span>
        </button>

        <button className="btn btn-link btn-xs items-center gap-1 text-error" onClick={() => setDeleteDialog(true)}>
          <MIcon>
            <IconLaTrashAltSolid />
          </MIcon>

          <span>Delete</span>
        </button>
      </MFeatureCard.Footer>
    </MFeatureCard.Parent>
  )
})
