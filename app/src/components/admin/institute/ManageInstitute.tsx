import { zodResolver } from '@hookform/resolvers/zod'
import { MInput } from 'components/lib/MInput'
import { useRouter } from 'next/router'
import { useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { copyToClip } from 'utils/helpers'
import { z } from 'zod'
import { useAlert } from 'components/lib/store/alerts'
import { useInstitute } from 'contexts'
import { useGlobalError } from 'utils/hooks'
import { manageInstituteSchema } from 'schemas'
import { MSelect } from 'components/lib/MSelect'
import { MForm } from 'components/lib/MForm'

const INSTITUTE_STATUS = ['ONBOARDED', 'INPROGRESS', 'PENDING'].map((v) => ({ label: v, value: v }))

export const ManageInstitute: React.FC<any> = () => {
  const router = useRouter()
  const setAlert = useAlert()

  const setError = useGlobalError()
  const isEditMode = useMemo(
    () => router.query.instituteId !== undefined && router.query.instituteId.length > 0,
    [router.query],
  )

  const {
    institute: instituteData,
    update,
    create,
  } = useInstitute({
    onSuccess(data) {
      const { code, name, status, account } = data
      code !== null && setValue('code', code)
      name !== null && setValue('name', name)
      status !== null && setValue('status', status)
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      account !== null && account.email !== null && setValue('email', account.email)
    },
    onError(e) {
      setError(e)

      if (e?.data?.code === 'NOT_FOUND') {
        void router.push('/admin/institute')
      }
    },
  })

  const inputFile = useRef<HTMLInputElement>(null)
  const uploadFile = useRef<File | null>(null)

  const form = useForm<z.infer<typeof manageInstituteSchema>>({
    resolver: zodResolver(manageInstituteSchema),
    defaultValues: {
      code: '',
      logo: '',
      name: '',
      status: 'PENDING',
    },
    shouldFocusError: true,
  })

  const { register, handleSubmit, formState, setValue } = form

  async function createInstitute(data: z.infer<typeof manageInstituteSchema>) {
    await create(data)
  }

  async function updateInstitute(data: z.infer<typeof manageInstituteSchema>) {
    update.mutate({ ...data, instituteId: Number(router.query.instituteId) })
  }

  // TODO: logo upload
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files != null) {
      uploadFile.current = e.target.files[0]
    }
  }

  function exportSignupLink() {
    if (instituteData == null) return ''

    const { origin } = location
    const { account } = instituteData

    if (account == null) return

    const link = `${origin}/reset-password?${new URLSearchParams({
      accountId: String(account.id),
      token: account.accountToken ?? '',
    }).toString()}`

    void copyToClip(link).then(() => setAlert({ message: 'Signup link copied to clipboard !', type: 'success' }))
  }

  return (
    <>
      {' '}
      <div className="text-lg font-medium leading-6    ">
        {isEditMode ? (
          <>
            Manage <span className="font-bold text-primary">{instituteData?.name}</span>
          </>
        ) : (
          'Create new institute'
        )}
      </div>
      <MForm
        form={form}
        className="form-control flex w-full sm:w-80"
        onSubmit={handleSubmit(isEditMode ? updateInstitute : createInstitute)}
      >
        <MInput label="Name" {...register('name')} placeholder="Institute name" error={formState.errors.name} />

        <MInput
          disabled={instituteData != null && instituteData.status !== 'PENDING'}
          label="Email"
          {...register('email')}
          placeholder="Institute Email"
          error={formState.errors.email}
        />

        <MInput
          disabled={isEditMode && instituteData?.status !== null}
          label="Code"
          {...register('code')}
          placeholder="Institute code"
          error={formState.errors.code}
        />

        {/* <label className="label">
          <span className="label-text">Onboarding status</span>
        </label>
        <select className="select-bordered select-primary select select-sm" {...register('status')}>
          {instituteStatus.map((val, key) => {
            return (
              <option key={key} value={val}>
                {' '}
                {val}{' '}
              </option>
            )
          })}
        </select>
        <label className="label">
          {formState.errors.status != null && (
            <span className="label-text-alt"> {formState.errors.status.message} </span>
          )}{' '}
        </label> */}

        <MSelect label="Onboarding status" name="status" options={INSTITUTE_STATUS} error={formState.errors.status} />

        <label className="label">
          <span className="label-text">Logo</span>
        </label>
        <label className="block">
          <span className="sr-only">Choose institute logo</span>
          <input type="file" className="file-input" multiple={false} onChange={handleFileChange} ref={inputFile} />
        </label>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={async () => await router.push('/admin/institute')}
            className="   btn btn-outline btn-sm mt-5"
          >
            Cancel{' '}
          </button>

          <button type="submit" className="   btn btn-sm mt-5">
            {isEditMode ? 'Update' : 'Create'}
          </button>
          {isEditMode && instituteData?.status === 'PENDING' && (
            <button
              type="button"
              onClick={exportSignupLink}
              className="   btn btn-sm mt-5"
              title="Generate Signup link for institute"
            >
              {' '}
              Copy Signup link
            </button>
          )}
        </div>
      </MForm>
    </>
  )
}
