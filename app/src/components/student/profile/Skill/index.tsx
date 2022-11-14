import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useSkills } from '../../../../contexts'
import { createSkillSchema } from '@mirai/schema'
import { StudentSkill, studentSkillsAtom, useUser } from '../../../../stores'
import { MDialog, MForm, MInput, MSelect } from '../../../lib'
import { SkillCard } from './SkillCard'
import IconPhPlus from '~icons/ph/plus'

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

  const { handleSubmit, reset, setValue } = form

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
        <div className="text-lg font-medium leading-6    ">Skills</div>
        <button className="flex-start btn-ghost btn-sm btn gap-2" onClick={() => setDialog(true)}>
          <span>
            <IconPhPlus />
          </span>
          <span>Add new Skill</span>
        </button>
      </div>

      {skills.length > 0 ? (
        <div className="grid-col-1 grid gap-2 sm:grid-cols-2">
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
          <div className="text-lg font-medium leading-6    ">Skill</div>

          <div className="grid grid-cols-1 gap-2">
            <MInput label="Skill name" name="name" placeholder="JavaScript" disabled={isEdit || isReadonly} />

            <MSelect label="Proficiency" options={SKILL_SCORES} name="score" disabled={isReadonly} />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setDialog(false)
                resetForm()
              }}
              className="   btn-outline btn-sm btn mt-5"
            >
              Cancel
            </button>

            {!isReadonly && (
              <button type="submit" className={clsx(['   btn-sm btn mt-5', isLoading && 'loading'])}>
                Save
              </button>
            )}
          </div>
        </MForm>
      </MDialog>
    </div>
  )
}
