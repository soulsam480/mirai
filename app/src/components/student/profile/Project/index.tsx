import { zodResolver } from '@hookform/resolvers/zod'
import type { StudentProject } from '@prisma/client'
import clsx from 'clsx'
import { MCheckbox } from 'components/lib/MCheckbox'
import { MDialog } from 'components/lib/MDialog'
import { MForm } from 'components/lib/MForm'
import { MInput } from 'components/lib/MInput'
import { useProject } from 'contexts/student/projects'
import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'
import omit from 'lodash/omit'
import React, { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { createProjectSchema } from 'schemas'
import { studentProjectsAtom } from 'stores/student'
import { useUser } from 'stores/user'
import { OverWrite, StudentProfileIgnore } from 'types'
import { STUDENT_PROFILE_IGNORE_KEYS } from 'utils/constnts'
import { formatDate, getDiff } from 'utils/helpers'
import { z } from 'zod'
import { ProjectCard } from './ProjectCard'

interface Props {}

type StudentProjectDateStrings = Omit<
  OverWrite<StudentProject, { startedAt: string; endedAt: string | null }>,
  StudentProfileIgnore
>

export const Projects: React.FC<Props> = () => {
  const projects = useAtomValue(studentProjectsAtom)
  const { create, update, isLoading } = useProject()
  const userData = useUser()

  const [selectedProject, setSelected] = useState<number | null>(null)
  const [isDialog, setDialog] = useState(false)
  const [isReadonly, setReadonly] = useState(false)

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema.omit({ studentId: true })),
    defaultValues: {
      title: '',
      description: '',
      domain: '',
      isOngoing: false,
      endedAt: undefined,
    },
    shouldFocusError: true,
  })

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    setError,
  } = form

  const isOngoingVal = useWatch({
    control,
    name: 'isOngoing',
  })

  useEffect(() => {
    isOngoingVal === true && setValue('endedAt', '')
  }, [isOngoingVal, setValue])

  function validateEndedAt(val: z.infer<typeof createProjectSchema>) {
    const { endedAt, startedAt, isOngoing } = val

    if (isOngoing === true) return true

    if (endedAt === null || endedAt.length === 0) {
      setError('endedAt', { message: 'Ended at is required' })

      return false
    }

    if (startedAt?.length > 0 && !dayjs(startedAt).isBefore(dayjs(endedAt))) {
      setError('endedAt', { message: "Ended at can't be before Started at" })

      return false
    }

    return true
  }

  async function submitHandler(val: z.infer<typeof createProjectSchema>, createProject: boolean) {
    if (!validateEndedAt(val)) return

    if (createProject && userData.studentId !== null) {
      await create({
        ...val,
        studentId: userData.studentId,
      })

      setDialog(false)
      resetForm()
    }

    if (!createProject && selectedProject !== null) {
      // TODO: simplify setup to only update diff
      let currExp = projects.find(({ id }) => id === selectedProject) as unknown as StudentProjectDateStrings

      currExp = omit(currExp, [...STUDENT_PROFILE_IGNORE_KEYS, 'studentId', 'id']) as StudentProjectDateStrings

      const diff = getDiff(currExp, val)

      await update({
        ...diff,
        id: selectedProject,
      })

      setDialog(false)
      resetForm()
    }
  }

  function handleProjectSelection({ studentId: _sid, id, ...rest }: StudentProject, readOnly = false) {
    setSelected(id)
    setDialog(true)

    readOnly && setReadonly(true)

    Object.entries(rest).forEach(([key, value]) => {
      if (STUDENT_PROFILE_IGNORE_KEYS.includes(key) === true) return

      // ! This is an issue with native date input
      // ! The element expects an output/input in the format YYYY-MM-DD but it shows as MM/DD/YYYY inside the element
      setValue(key as any, ['startedAt', 'endedAt'].includes(key) ? formatDate(value, 'YYYY-MM-DD') : value)
    })
  }

  function resetForm() {
    reset()
    setSelected(null)
    setReadonly(false)
  }

  // TODO: add document upload
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium leading-6    ">Projects</div>
        <button className="flex-start btn btn-ghost btn-sm gap-2" onClick={() => setDialog(true)}>
          <span>
            <IconLaPlusCircle />
          </span>
          <span>Add new Project</span>
        </button>
      </div>

      {projects.length > 0 ? (
        <div className="grid-col-1 grid gap-2 sm:grid-cols-2">
          {projects.map((project) => {
            return (
              <ProjectCard
                project={project}
                key={project.id}
                onEdit={(readOnly) => handleProjectSelection(project, readOnly)}
              />
            )
          })}
        </div>
      ) : (
        <h4> You have not added any project yet !</h4>
      )}

      <MDialog show={isDialog} onClose={() => null} noEscape>
        <MForm
          form={form}
          onSubmit={handleSubmit((data) => {
            void submitHandler(data, selectedProject === null)
          })}
          className="flex flex-col gap-2 md:w-[700px] md:max-w-[700px]"
        >
          <div className="text-lg font-medium leading-6    ">Project</div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <MInput
                {...register('title')}
                error={errors.title}
                label="Project title"
                name="title"
                placeholder="My awesome project"
                disabled={isReadonly}
              />

              <MInput
                error={errors.startedAt}
                {...register('startedAt')}
                name="startedAt"
                label="Started at"
                type="date"
                disabled={isReadonly}
              />
              <MCheckbox
                error={errors.isOngoing}
                name="isOngoing"
                label="I'm currently working on this project"
                disabled={isReadonly}
              />
            </div>

            <div>
              <MInput
                {...register('domain')}
                error={errors.domain}
                label="Project domain"
                name="domain"
                placeholder="Web development"
                disabled={isReadonly}
              />

              {isOngoingVal === false && (
                <MInput
                  error={errors.endedAt}
                  {...register('endedAt')}
                  name="endedAt"
                  label="Ended at"
                  type="date"
                  disabled={isReadonly}
                />
              )}
            </div>
          </div>

          <MInput
            {...register('description')}
            error={errors.description}
            as="textarea"
            label="Description"
            name="description"
            disabled={isReadonly}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setDialog(false)
                resetForm()
              }}
              className="   btn btn-outline btn-sm mt-5"
            >
              Cancel
            </button>

            {!isReadonly && (
              <button type="submit" className={clsx(['   btn btn-sm mt-5', isLoading === true && 'loading'])}>
                Save
              </button>
            )}
          </div>
        </MForm>
      </MDialog>
    </div>
  )
}
