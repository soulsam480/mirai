import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { MDialog } from 'components/lib/MDialog'
import { MForm } from 'components/lib/MForm'
import { MInput } from 'components/lib/MInput'
import { MSelect } from 'components/lib/MSelect'
import { useSkills } from 'contexts/student/skills'
import { useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createSkillSchema } from 'schemas'
import { StudentSkill, studentSkillsAtom } from 'stores/student'
import { useUser } from 'stores/user'
import { z } from 'zod'
import { SkillCard } from './SkillCard'

interface Props {}

const SKILL_SCORES = ['Beginner', 'Intermediate', 'Expert'].map((s) => ({ label: s, value: s }))

export const Skills: React.FC<Props> = () => {
  const skills = useAtomValue(studentSkillsAtom)
  const { update, isLoading } = useSkills()
  const userData = useUser()

  const [isDialog, setDialog] = useState(false)
  const [isReadonly, setReadonly] = useState(false)
  const [isEdit, setEdit] = useState(false)

  const form = useForm<z.infer<typeof createSkillSchema>>({
    resolver: zodResolver(createSkillSchema),
    defaultValues: {
      name: '',
      score: 'Beginner',
    },
    shouldFocusError: true,
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = form

  async function submitHandler(val: z.infer<typeof createSkillSchema>, del = false) {
    if (userData.studentId === null) return

    let changedSkills = [...skills]

    const skillIdx = changedSkills.findIndex((v) => v.name === val.name)

    if (del) {
      changedSkills = changedSkills.filter((v) => v.name !== val.name && v.score !== val.score)
    } else if (skillIdx === -1) {
      changedSkills.push(val)
    } else {
      changedSkills.splice(skillIdx, 1, val)
    }

    await update({
      studentId: userData.studentId,
      skills: changedSkills,
    })

    setDialog(false)
    resetForm()
  }

  function resetForm() {
    reset()
    setEdit(false)
  }

  async function handleSkill(val: StudentSkill, mode?: 'delete' | 'readonly') {
    if (mode === 'delete') {
      return await submitHandler(val, true)
    }

    mode === 'readonly' && setReadonly(true)
    Object.keys(val).forEach((key: any) => setValue(key, val[key as keyof StudentSkill]))
    setDialog(true)
    setEdit(true)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium leading-6 text-gray-900">Skills</div>
        <button className="gap-2 flex-start btn btn-sm btn-secondary" onClick={() => setDialog(true)}>
          <span>
            <IconLaPlusCircle />
          </span>
          <span>Add new Skill</span>
        </button>
      </div>

      {skills.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2 grid-col-1">
          {skills.map((skill, i) => {
            return <SkillCard skill={skill} key={i} onEdit={handleSkill} />
          })}
        </div>
      ) : (
        <h4> You have not added any skill yet !</h4>
      )}

      <MDialog show={isDialog} onClose={() => null} noEscape>
        <MForm
          form={form}
          onSubmit={handleSubmit(async (data) => await submitHandler(data))}
          className="flex flex-col gap-2 md:w-[350px] md:max-w-[350px]"
        >
          <div className="text-lg font-medium leading-6 text-gray-900">Skill</div>

          <div className="grid grid-cols-1 gap-2">
            <MInput
              {...register('name')}
              error={errors.name}
              label="Skill name"
              name="name"
              placeholder="JavaScript"
              disabled={isEdit || isReadonly}
            />

            <MSelect
              label="Proficiency"
              options={SKILL_SCORES}
              error={errors.score}
              name="score"
              disabled={isReadonly}
            />
          </div>

          {!isReadonly && (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setDialog(false)
                  resetForm()
                }}
                className="mt-5 btn btn-sm btn-primary btn-outline"
              >
                Cancel
              </button>

              <button type="submit" className={clsx(['mt-5 btn btn-sm btn-primary', isLoading === true && 'loading'])}>
                Save
              </button>
            </div>
          )}
        </MForm>
      </MDialog>
    </div>
  )
}
