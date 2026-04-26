import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Info } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { editFeedback, submitFeedback } from '../../api/feedbacks.api'
import useAuthStore from '../../store/authStore'
import { scoreColor } from '../../utils/helpers'
import Button from '../ui/Button'
import { useToast } from '../ui/Toast'

const DIMENSIONS = [
  { key: 'market', label: 'Market', tip: 'Market demand and problem urgency' },
  { key: 'innovation', label: 'Innovation', tip: 'Uniqueness and differentiation' },
  { key: 'feasibility', label: 'Feasibility', tip: 'Execution realism and complexity' },
  { key: 'roi', label: 'ROI', tip: 'Revenue potential and sustainability' },
]

export default function FeedbackForm({ ideaId, existingFeedback = null, ideaOwnerId, onSuccess }) {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const toast = useToast()

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      market:      existingFeedback?.market_score      || 0,
      innovation:  existingFeedback?.innovation_score  || 0,
      feasibility: existingFeedback?.feasibility_score || 0,
      roi:         existingFeedback?.roi_score         || 0,
      comment:     existingFeedback?.comment           || '',
    },
  })

  const total = Number(watch('market') || 0) + Number(watch('innovation') || 0) + Number(watch('feasibility') || 0) + Number(watch('roi') || 0)
  const commentLength = (watch('comment') || '').length

  const mutation = useMutation({
    mutationFn: (payload) => existingFeedback
      ? editFeedback(existingFeedback.id, payload)
      : submitFeedback(ideaId, payload),
    onSuccess: () => {
      toast.success('Feedback submitted!')
      queryClient.invalidateQueries({ queryKey: ['feedbacks', String(ideaId)] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(error?.response?.data?.detail || 'Could not submit feedback')
    },
  })

  const editWindowClosed = existingFeedback?.updated_at
    ? (Date.now() - new Date(existingFeedback.updated_at).getTime()) > 24 * 60 * 60 * 1000
    : false

  if (editWindowClosed)   return <Message text='Edit window has closed (24h limit)' />
  if (!user)              return <Message text='Please login to submit feedback' />
  if (user.role !== 'reviewer') return <Message text='Only reviewers can submit feedback' />
  if (String(user.id) === String(ideaOwnerId)) return <Message text='You cannot review your own idea' />

  const onSubmit = (values) => {
    mutation.mutate({
      market_score:      Number(values.market),
      innovation_score:  Number(values.innovation),
      feasibility_score: Number(values.feasibility),
      roi_score:         Number(values.roi),
      comment:           values.comment,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 rounded-xl border bg-white p-4'>
      {DIMENSIONS.map((d) => {
        const v = Number(watch(d.key) || 0)
        const color = v <= 8 ? 'text-secondary' : v <= 16 ? 'text-secondary' : 'text-secondary'
        return (
          <div key={d.key}>
            <div className='mb-1 flex items-center justify-between text-sm'>
              <label className='font-medium'>
                {d.label}
                <span className='ml-1 inline-block align-middle' title={d.tip}><Info size={12} className='text-slate-400' /></span>
              </label>
              <span className={color}>{v}/25</span>
            </div>
            <input type='range' min='0' max='25' {...register(d.key)} className='w-full' />
          </div>
        )
      })}

      <div className={`rounded-lg border px-3 py-2 text-center ${scoreColor(total)}`}>
        <p className='text-xs uppercase'>Your Score</p>
        <p className='text-2xl font-bold'>{total}</p>
      </div>

      <div>
        <textarea
          {...register('comment', { required: 'Comment is required', minLength: { value: 50, message: 'Minimum 50 chars' } })}
          rows={5}
          className='w-full rounded-lg border px-3 py-2 text-sm'
          placeholder='Explain your ratings in detail...'
        />
        <div className='mt-1 flex items-center justify-between text-xs text-slate-500'>
          <span>{errors.comment?.message || ''}</span>
          <span>{commentLength} chars</span>
        </div>
      </div>

      <Button type='submit' loading={mutation.isPending}>
        {existingFeedback ? 'Update Feedback' : 'Submit Feedback'}
      </Button>
    </form>
  )
}

function Message({ text }) {
  return <div className='rounded-xl border bg-white p-4 text-sm text-slate-600'>{text}</div>
}
