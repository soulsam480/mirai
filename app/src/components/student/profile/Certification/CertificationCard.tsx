import type { StudentCertification } from '@prisma/client'
import React, { useState } from 'react'
import { useCertification } from '../../../../contexts'
import { formatDate } from '../../../../utils'
import { MAlertDialog, MFeatureCard, MIcon } from '../../../lib'

interface Props {
  certification: StudentCertification
  onEdit: (readOnly?: boolean) => void
}

export const CertificationCard = React.memo<Props>(({ certification, onEdit }) => {
  const [isDeleteDialog, setDeleteDialog] = useState(false)

  const { removeCertification } = useCertification()

  return (
    <MFeatureCard.Parent>
      <MAlertDialog
        label={
          <>
            Remove certification <span className="font-semibold">{certification.name}</span> ?
          </>
        }
        onConfirm={async () => {
          await removeCertification(certification.id)

          setDeleteDialog(false)
        }}
        show={isDeleteDialog}
        onReject={() => setDeleteDialog(false)}
      />

      <MFeatureCard.Body>
        <div className="flex items-center gap-2">
          <MIcon className="text-base">
            <IconPhGraduationCap />
          </MIcon>
          <span className="text-lg">{certification.name}</span>
        </div>

        {Boolean(certification.subject) && (
          <div className="flex items-center gap-2">
            <MIcon className="text-sm">
              <IconPhBookOpen />
            </MIcon>

            <span className="text-sm">{certification.subject}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <MIcon className="text-sm">
            <IconPhBuildings />
          </MIcon>
          <span className="text-sm">{certification.institute}</span>
        </div>

        {(Boolean(certification.date) || Boolean(certification.expiresAt)) && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <MIcon className="text-sm">
                <IconPhCalendar />
              </MIcon>

              <span className="text-xs">
                {Boolean(certification.date) && <span>Issued on {formatDate(certification.date, 'DD MMM YYYY')} </span>}

                {Boolean(certification.expiresAt) && (
                  <>
                    <span className="mx-0.5">.</span>
                    <span> Expires on {formatDate(certification.expiresAt, 'DD MMM YYYY')} </span>
                  </>
                )}
              </span>
            </div>
          </div>
        )}
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
