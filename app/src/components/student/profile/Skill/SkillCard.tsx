import React, { useState } from 'react'
import { StudentSkill } from '../../../../stores'
import { MAlertDialog, MFeatureCard, MIcon } from '../../../lib'
import IconPhShieldCheckered from '~icons/ph/shield-checkered'
import IconPhRuler from '~icons/ph/ruler'
import IconPhPencilSimple from '~icons/ph/pencil-simple'
import IconPhTrash from '~icons/ph/trash'

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
