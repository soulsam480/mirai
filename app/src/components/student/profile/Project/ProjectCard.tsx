import { StudentProject } from '@prisma/client'
import { MAlertDialog } from 'components/lib/MAlertDialog'
import { MIcon } from 'components/lib/MIcon'
import { useProject } from 'contexts/student/projects'
import React, { useState } from 'react'
import { formatDate } from 'utils/helpers'

interface Props {
  project: StudentProject
  onEdit: (readOnly?: boolean) => void
}

export const ProjectCard = React.memo<Props>(({ project, onEdit }) => {
  const [isDeleteDialog, setDeleteDialog] = useState(false)

  const { deleteProject } = useProject()

  return (
    <div className="relative flex flex-col gap-1 p-2 transition-shadow duration-200 ease-in-out rounded-md hover:shadow bg-amber-100">
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

      <div className="flex items-center gap-2 ">
        <MIcon className="text-base">
          <IconLaRocket />
        </MIcon>

        <span className="text-lg">{project.title}</span>
      </div>

      <div className="flex items-center gap-2 ">
        <MIcon className="text-sm">
          <IconLaFlask />
        </MIcon>

        <span className="text-sm">{project.domain}</span>
      </div>

      <div className="flex items-center gap-2">
        <MIcon className="text-sm">
          <IconLaCalendar />
        </MIcon>
        <span className="text-xs">
          {formatDate(project.startedAt)} <span className="mx-0.5">to&nbsp;</span>
          {project.isOngoing && (project.endedAt === null || project.endedAt === undefined)
            ? 'Present'
            : formatDate(project.endedAt)}
        </span>
      </div>

      <div className="flex justify-end gap-2">
        {/* // TODO: readonly mode */}
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
      </div>
    </div>
  )
})
