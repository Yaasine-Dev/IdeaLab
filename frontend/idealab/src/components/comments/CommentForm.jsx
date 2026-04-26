import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { postComment } from '../../api/comments.api'
import useAuthStore from '../../store/authStore'
import Button from '../ui/Button'
import { useToast } from '../ui/Toast'

export default function CommentForm({ ideaId, parentId = null, onSuccess, onCancel }) {
  const user = useAuthStore((s) => s.user)
  const toast = useToast()
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({ defaultValues: { content: '' } })

  const mutation = useMutation({
    mutationFn: (data) => postComment(ideaId, data),
    onSuccess: () => {
      toast.success('Comment posted')
      reset()
      queryClient.invalidateQueries({ queryKey: ['comments', String(ideaId)] })
      onSuccess?.()
    },
    onError: (error) => toast.error(error?.response?.data?.detail || 'Could not post comment'),
  })

  if (!user) return null

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate({ parent: parentId || null, content: values.content }))}
      className='rounded-xl border bg-white p-3'
    >
      <textarea
        {...register('content', {
          required: 'Comment is required',
          minLength: { value: 3, message: 'At least 3 characters' },
          maxLength: { value: 1000, message: 'Max 1000 characters' },
        })}
        rows={3}
        className='w-full rounded-lg border px-3 py-2 text-sm'
        placeholder='Write your comment...'
      />
      <div className='mt-1 flex items-center justify-between text-xs text-slate-500'>
        <span>{errors.content?.message || ''}</span>
        <span>{(watch('content') || '').length}/1000</span>
      </div>
      <div className='mt-2 flex gap-2'>
        <Button type='submit' loading={mutation.isPending} size='sm'>
          {parentId ? 'Reply' : 'Post Comment'}
        </Button>
        {onCancel && <Button type='button' size='sm' variant='ghost' onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  )
}
