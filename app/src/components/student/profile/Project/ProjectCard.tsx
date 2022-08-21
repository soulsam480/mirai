import { StudentProject } from '@prisma/client'
import React, { useState } from 'react'
import { useProject } from '../../../../contexts'
import { formatDate } from '../../../../utils'
import { MAlertDialog, MFeatureCard, MIcon } from '../../../lib'

interface Props {
  project: StudentProject
  onEdit: (readOnly?: boolean) => void
}

export const ProjectCard = React.memo<Props>(({ project, onEdit }) => {
  const [isDeleteDialog, setDeleteDialog] = useState(false)

  const { deleteProject } = useProject()

  return (
    <MFeatureCard.Parent>
      <MAlertDialog
        label={
          <>
            Remove project <span className="font-semibold">{project.title}</span> ?
          </>
        }
        onConfirm={async () => {
          await deleteProject(project.id)

          setDeleteDialog(false)
        }}
        show={isDeleteDialog}
        onReject={() => setDeleteDialog(false)}
      />

      <MFeatureCard.Body>
        <div className="flex items-center gap-2 ">
          <MIcon className="text-base">
            <IconPhRocket />
          </MIcon>

          <span className="text-lg">{project.title}</span>
        </div>
        <div className="flex items-center gap-2 ">
          <MIcon className="text-sm">
            <IconPhBracketsAngle />
          </MIcon>

          <span className="text-sm">{project.domain}</span>
        </div>
        <div className="flex items-center gap-2">
          <MIcon className="text-sm">
            <IconPhCalendar />
          </MIcon>
          <span className="text-xs">
            {formatDate(project.startedAt)} <span className="mx-0.5">to&nbsp;</span>
            {project.isOngoing && (project.endedAt === null || project.endedAt === undefined)
              ? 'Present'
              : formatDate(project.endedAt)}
          </span>
        </div>
      </MFeatureCard.Body>

      <MFeatureCard.Footer>
        {/* // TODO: readonly mode */}
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
