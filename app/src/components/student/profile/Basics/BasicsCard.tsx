import { MIcon } from '../../../../components/lib'
import pick from 'lodash/pick'
import React from 'react'
import type { StudentAddress, StudentBasicsOverwrite } from '../../../../stores'
import { formatDate } from '../../../../utils'
import IconPhIdentificationCard from '~icons/ph/identification-card'
import IconPhPencilSimple from '~icons/ph/pencil-simple'
import IconPhEnvelope from '~icons/ph/envelope'

interface Props {
  studentBasics: StudentBasicsOverwrite | null
  onTrigger: (mode: 'contact' | 'basics') => void
}

function normalizeAddress({ address, city, country, district, pin, state }: StudentAddress) {
  return [address, city, district, state, pin, country].filter((v) => v !== undefined && v.length > 0).join(', ')
}

export const BasicsCard: React.FC<Props> = ({ studentBasics, onTrigger }) => {
  return (
    // We do this because basics will be there before student creation bby default
    <div className="flex flex-col gap-2 rounded-md bg-base-200 p-2 shadow">
      <div className="flex justify-between">
        <div className="flex items-center gap-2 text-left">
          <MIcon>
            <IconPhIdentificationCard />
          </MIcon>

          <h4>Identity details</h4>
        </div>

        <button className="flex-start btn btn-ghost btn-xs gap-2" onClick={() => onTrigger('basics')}>
          <span>
            <IconPhPencilSimple />
          </span>
          <span>Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 text-sm">
        <div>Name </div>
        <div className="col-span-3">{studentBasics?.name ?? '-'}</div>

        <div>Gender </div>
        <div className="col-span-3">{studentBasics?.gender ?? '-'}</div>

        <div>Category </div>
        <div className="col-span-3">{studentBasics?.category ?? '-'}</div>

        <div>Date of birth </div>
        <div className="col-span-3">
          {(studentBasics?.dob !== undefined && formatDate(studentBasics.dob, 'DD MMM YYYY').length > 0) || '-'}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex items-center gap-2 text-left">
          <MIcon>
            <IconPhEnvelope />
          </MIcon>

          <h4>Contact details</h4>
        </div>

        <button
          className="flex-start btn btn-ghost btn-xs gap-2"
          onClick={() => onTrigger('contact')}
          disabled={Object.values(pick(studentBasics, ['name', 'gender', 'category', 'dob'])).some(
            // may break
            // TODO: check later
            (v) => v === undefined || String(v).length === 0,
          )}
        >
          <span>
            <IconPhPencilSimple />
          </span>
          <span>Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 text-sm">
        <div>Mobile Number </div>
        <div className="col-span-3">{studentBasics?.mobileNumber ?? '-'}</div>

        <div>Primary Email </div>
        <div className="col-span-3">{studentBasics?.primaryEmail ?? '-'}</div>

        <div>Secondary Email </div>
        <div className="col-span-3">{studentBasics?.secondaryEmail ?? '-'}</div>

        <div>Permanent address </div>
        {/* // TODO: break when length is more */}
        <div className="col-span-3 max-w-full break-words">
          {studentBasics?.permanentAddress === undefined ? '-' : normalizeAddress(studentBasics.permanentAddress)}
        </div>

        <div>Current address </div>

        <div className="col-span-3 max-w-full break-words">
          {studentBasics?.currentAddress === undefined ? '-' : normalizeAddress(studentBasics.currentAddress)}
        </div>
      </div>
    </div>
  )
}
