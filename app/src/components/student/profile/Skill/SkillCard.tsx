import { MAlertDialog } from 'components/lib/MAlertDialog'
import MFeatureCard from 'components/lib/MFeatureCard'
import { MIcon } from 'components/lib/MIcon'
import React, { useState } from 'react'
import type { StudentSkill } from 'stores/student'

interface Props {
  skill: StudentSkill
  onEdit: (val: StudentSkill, mode?: 'readonly' | 'delete') => void
}

export const SkillCard = React.memo<Props>(({ skill, onEdit }) => {
  const [isDeleteDialog, setDeleteDialog] = useState(false)

  return (
    <MFeatureCard.Parent>
      <MAlertDialog
        label={
          <>
            Remove skill <span className="font-semibold">{skill.name}</span> ?
          </>
        }
        onConfirm={async () => {
          onEdit(skill, 'delete')

          setDeleteDialog(false)
        }}
        show={isDeleteDialog}
        onReject={() => setDeleteDialog(false)}
      />

      <MFeatureCard.Body>
        <div className="flex items-center gap-2 ">
          <MIcon className="text-base">
            <IconPhShieldCheckered />
          </MIcon>
          <span className="text-lg">{skill.name}</span>
        </div>

        <div className="flex items-center gap-2 ">
          <MIcon className="text-sm">
            <IconPhRuler />
          </MIcon>
          <span className="text-sm">{skill.score}</span>
        </div>
      </MFeatureCard.Body>

      <MFeatureCard.Footer>
        {/* // TODO: read only mode */}
        <button className="btn btn-ghost btn-xs items-center gap-1 text-base-content" onClick={() => onEdit(skill)}>
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
