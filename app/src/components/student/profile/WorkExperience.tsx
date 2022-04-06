import { zodResolver } from '@hookform/resolvers/zod'
import { MCheckbox } from 'components/lib/MCheckbox'
import { MDialog } from 'components/lib/MDialog'
import { MInput } from 'components/lib/MInput'
import React, { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { createExperienceSchema } from 'schemas'
import { z } from 'zod'

interface Props {}

export const WorkExperience: React.FC<Props> = () => {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof createExperienceSchema>>({
    resolver: zodResolver(createExperienceSchema.omit({ studentId: true })),
    defaultValues: {
      company: '',
      title: '',
      location: '',
      type: 'NA',
      jobType: '',
      companySector: '',
      stipend: '',
      notes: '',
      isCurriculum: true,
      isOngoing: false,
    },
    shouldFocusError: true,
  })

  const isOngoingVal = useWatch({
    control,
    name: 'isOngoing',
  })

  function submitHandler(val: any) {
    // eslint-disable-next-line no-console
    console.log(val)
  }

  const [isDialog, setDialog] = useState(false)

  return (
    <div>
      <MDialog show={isDialog} onClose={setDialog}>
        <div className="flex flex-col gap-2">
          <div className="mb-4 text-lg font-medium leading-6 text-gray-900">Work experience</div>

          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <MInput
                  {...register('company')}
                  error={errors.company}
                  label="Company / Institute name"
                  name="company"
                  placeholder="Acme Inc."
                />

                <MInput
                  {...register('title')}
                  error={errors.title}
                  label="Title / Designation"
                  name="title"
                  placeholder="Business analyst"
                />

                <MInput
                  {...register('location')}
                  error={errors.location}
                  label="Location"
                  name="location"
                  placeholder="Location"
                />

                <MInput
                  error={errors.startedAt}
                  {...register('startedAt', {
                    validate(val) {
                      return new Date(val) instanceof Date
                    },
                  })}
                  name="startedAt"
                  label="Started at"
                  type="date"
                />

                <MCheckbox control={control} error={errors.isOngoing} name="isOngoing" label="I currently work here" />
              </div>

              <div>
                <MInput
                  {...register('companySector')}
                  error={errors.companySector}
                  label="Company sector"
                  name="companySector"
                  placeholder="Information Technology"
                />
                <MInput
                  {...register('stipend')}
                  error={errors.stipend}
                  label="Stipend"
                  name="stipend"
                  placeholder="0-5K"
                />

                <MInput
                  {...register('jobType')}
                  error={errors.jobType}
                  label="Position type"
                  name="jobType"
                  placeholder="Full time"
                />

                {isOngoingVal === false && (
                  <MInput error={errors.endedAt} {...register('endedAt')} name="endedAt" label="Ended at" type="date" />
                )}

                <MCheckbox
                  control={control}
                  error={errors.isCurriculum}
                  name="isCurriculum"
                  label="Included in curriculam"
                />
              </div>
            </div>

            <MInput {...register('notes')} error={errors.notes} as="textarea" label="Description" name="notes" />
            <div className="text-right">
              <button type="submit" className="mt-5 btn btn-sm btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </MDialog>
    </div>
  )
}
