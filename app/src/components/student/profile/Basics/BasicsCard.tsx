import { MIcon } from 'components/lib/MIcon'
import pick from 'lodash/pick'
import React from 'react'
import type { StudentAddress, StudentBasicsOverwrite } from 'stores/student'
import { formatDate } from 'utils/helpers'

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
    <div className="flex flex-col gap-2 rounded-md bg-amber-100 p-2">
      <div className="flex justify-between">
        <div className="flex items-center gap-2 text-left">
          <MIcon>
            <IconLaIdCardSolid />
          </MIcon>

          <h4>Identity details</h4>
        </div>

        <button className="flex-start btn btn-secondary btn-xs gap-2" onClick={() => onTrigger('basics')}>
          <span>
            <IconLaPenSquare />
          </span>
          <span>Edit</span>
        </button>
      </div>

      <div className="flex justify-start gap-2 text-sm">
        <div className="flex min-w-[150px] flex-none flex-col gap-1">
          <div>Name: </div>
          <div>Gender: </div>
          <div>Category: </div>
          <div>Date of birth: </div>
        </div>

        <div className="flex  flex-grow flex-col gap-1">
          <div>{studentBasics?.name ?? '-'}</div>
          <div>{studentBasics?.gender ?? '-'}</div>
          <div>{studentBasics?.category ?? '-'}</div>
          <div>{(studentBasics?.dob !== undefined && formatDate(studentBasics.dob, 'DD MMM YYYY')) || '-'}</div>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex items-center gap-2 text-left">
          <MIcon>
            <IconLaMailBulk />
          </MIcon>

          <h4>Contact details</h4>
        </div>

        <button
          className="flex-start btn btn-secondary btn-xs gap-2"
          onClick={() => onTrigger('contact')}
          disabled={Object.values(pick(studentBasics, ['name', 'gender', 'category', 'dob'])).some(
            // may break
            // TODO: check later
            (v) => v === undefined || String(v).length === 0,
          )}
        >
          <span>
            <IconLaPenSquare />
          </span>
          <span>Edit</span>
        </button>
      </div>

      <div className="flex justify-start gap-2 text-sm">
        <div className="flex min-w-[150px] flex-none flex-col gap-1">
          <div>Mobile Number: </div>
          <div>Primary Email: </div>
          <div>Secondary Email: </div>
          <div>Permanent address: </div>
          <div>Current address: </div>
        </div>

        <div className="flex flex-grow flex-col gap-1">
          <div>{studentBasics?.mobileNumber ?? '-'}</div>
          <div>{studentBasics?.primaryEmail ?? '-'}</div>
          <div>
            {
              // eslint-disable-next-line no-extra-boolean-cast
              Boolean(studentBasics?.secondaryEmail) ? studentBasics?.secondaryEmail : '-'
            }
          </div>
          {/* // TODO: break when length is more */}
          <div>
            {studentBasics?.permanentAddress === undefined ? '-' : normalizeAddress(studentBasics.permanentAddress)}
          </div>
          <div>
            {studentBasics?.currentAddress === undefined ? '-' : normalizeAddress(studentBasics.currentAddress)}
          </div>
        </div>
      </div>
    </div>
  )
}
