import type { StudentBasics } from '@prisma/client'
import React from 'react'
import { JSONValue } from 'superjson/dist/types'
import { formatDate } from 'utils/helpers'

interface Props {
  studentBasics: StudentBasics
}

export const BasicsCard: React.FC<Props> = ({ studentBasics }) => {
  const { name, dob, category, gender, mobileNumber, primaryEmail, secondaryEmail, currentAddress, permanentAddress } =
    studentBasics

  const verifyField = (field: string | JSONValue | null) => (field !== '' && field !== null ? field : 'EMPTY')

  return (
    <div className="flex flex-col gap-2  bg-amber-100 p-2 rounded-md">
      <div className="flex gap-1">
        <span className="">Name: </span>
        <span className="font-semibold">{verifyField(name)}</span>
      </div>

      <div className="flex gap-1">
        <span>Gender: </span>
        <span className="font-semibold">{verifyField(gender)}</span>
      </div>

      <div className="flex gap-1">
        <span>Category: </span>
        <span className="font-semibold">{verifyField(category)}</span>
      </div>

      <div className="flex gap-1">
        <span>Date of birth: </span>
        <span className="font-semibold">{verifyField(formatDate(dob, 'DD MMMM YYYY'))}</span>
      </div>

      <div className="flex gap-1">
        <span>Mobile Number: </span>
        <span className="font-semibold">{verifyField(mobileNumber)}</span>
      </div>

      <div className="flex gap-1">
        <span>Primary Email: </span>
        <span className="font-semibold">{verifyField(primaryEmail)}</span>
      </div>

      <div className="flex gap-1">
        <span>Secondary Email: </span>
        <span className="font-semibold">{verifyField(secondaryEmail)}</span>
      </div>

      <div className="flex gap-1">
        <span>Current address: </span>
        <span className="font-semibold">{verifyField(currentAddress)}</span>
      </div>

      <div className="flex gap-1">
        <span>Permanent address: </span>
        <span className="font-semibold">{verifyField(permanentAddress)}</span>
      </div>
    </div>
  )
}
