import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { deleteComment, editComment, getComments } from '../../api/comments.api'
import { castVote } from '../../api/votes.api'
import useAuthStore from '../../store/authStore'
import { levelBadge, timeAgo } from '../../utils/helpers'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { useToast } from '../ui/Toast'
import CommentForm from './CommentForm'

export default function CommentTree({ ideaId }) {
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const toast = useToast()
  const [replyTo, setReplyTo] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', String(ideaId)],
    queryFn: async () => {
      const res = await getComments(ideaId)
      return Array.isArray(res.data?.results) ? res.data.results : (Array.isArray(res.data) ? res.data : [])
    },
    enabled: !!ideaId,
  })

  const roots = useMemo(() => comments.filter((c) => !c.parent_id), [comments])
  const repliesByParent = useMemo(() => {
    const map = {}
    comments.forEach((c) => {
      if (!c.parent_id) return
      if (!map[c.parent_id]) map[c.parent_id] = []
      map[c.parent_id].push(c)
    })
    return map
  }, [comments])

  const voteMutation = useMutation({
    mutationFn: ({ id, value }) => castVote({ target_type: 'comment', target_id: id, value }),
    onMutate: async ({ id, value }) => {
      await queryClient.cancelQueries({ queryKey: ['comments', String(ideaId)] })
      const previous = queryClient.getQueryData(['comments', String(ideaId)])
      queryClient.setQueryData(['comments', String(ideaId)], (old = []) => old.map((c) => c.id === id ? { ...c, votes_count: (c.votes_count || 0) + value } : c))
      return { previous }
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['comments', String(ideaId)], ctx.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['comments', String(ideaId)] }),
  })

  const editMutation = useMutation({
    mutationFn: ({ id, content }) => editComment(id, { content }),
    onSuccess: () => {
      setEditingId(null)
      setEditText('')
      queryClient.invalidateQueries({ queryKey: ['comments', String(ideaId)] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', String(ideaId)] }),
  })

  if (isLoading) {
    return <div className='space-y-2'>{Array.from({ length: 4 }).map((_, i) => <div key={i} className='h-20 animate-pulse rounded-xl bg-slate-100' />)}</div>
  }

  return (
    <div className='space-y-4'>
      {roots.map((comment) => (
        <div key={comment.id} className='space-y-2'>
          <CommentNode
            comment={comment}
            user={user}
            isEditing={editingId === comment.id}
            editText={editText}
            setEditText={setEditText}
            onEdit={() => {
              setEditingId(comment.id)
              setEditText(comment.content || '')
            }}
            onSaveEdit={() => editMutation.mutate({ id: comment.id, content: editText })}
            onCancelEdit={() => {
              setEditingId(null)
              setEditText('')
            }}
            onDelete={() => {
              if (window.confirm('Delete this comment?')) deleteMutation.mutate(comment.id)
            }}
            onVote={(value) => voteMutation.mutate({ id: comment.id, value })}
            onReplyToggle={() => setReplyTo((prev) => prev === comment.id ? null : comment.id)}
            canReply
          />

          {replyTo === comment.id && (
            <div className='ml-10'>
              <CommentForm ideaId={ideaId} parentId={comment.id} onSuccess={() => setReplyTo(null)} onCancel={() => setReplyTo(null)} />
            </div>
          )}

          {(repliesByParent[comment.id] || []).slice(0, 50).map((reply) => (
            <div key={reply.id} className='ml-8 border-l-2 border-gray-200 pl-4'>
              <CommentNode
                comment={reply}
                user={user}
                isEditing={editingId === reply.id}
                editText={editText}
                setEditText={setEditText}
                onEdit={() => {
                  setEditingId(reply.id)
                  setEditText(reply.content || '')
                }}
                onSaveEdit={() => editMutation.mutate({ id: reply.id, content: editText })}
                onCancelEdit={() => {
                  setEditingId(null)
                  setEditText('')
                }}
                onDelete={() => {
                  if (window.confirm('Delete this comment?')) deleteMutation.mutate(reply.id)
                }}
                onVote={(value) => voteMutation.mutate({ id: reply.id, value })}
              />
            </div>
          ))}
        </div>
      ))}

      <div className='pt-2'>
        <CommentForm ideaId={ideaId} />
      </div>
    </div>
  )
}

function CommentNode({
  comment,
  user,
  isEditing,
  editText,
  setEditText,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onVote,
  onReplyToggle,
  canReply = false,
}) {
  const isOwn = user && String(user.id) === String(comment.user?.id || comment.author?.id || comment.user_id)
  const deleted = comment.is_deleted

  return (
    <div className='rounded-xl border bg-white p-3'>
      <div className='mb-2 flex items-start gap-2'>
        <Avatar size='sm' src={comment.user?.avatar || comment.author?.avatar} username={comment.user?.username || comment.author?.username || 'U'} />
        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-2 text-sm'>
            <span className='font-semibold'>{comment.user?.username || comment.author?.username || 'Unknown'}</span>
            <Badge className={levelBadge(comment.user?.level || comment.author?.level)}>{comment.user?.level || comment.author?.level || 'bronze'}</Badge>
            <span className='text-slate-500'>{timeAgo(comment.created_at)}</span>
            {comment.updated_at && comment.updated_at !== comment.created_at && <span className='text-xs text-slate-400'>edited</span>}
          </div>

          {deleted ? (
            <p className='mt-1 text-sm italic text-slate-400'>[This comment was deleted]</p>
          ) : isEditing ? (
            <div className='mt-2'>
              <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={3} className='w-full rounded border px-2 py-1 text-sm' />
              <div className='mt-2 flex gap-2'>
                <Button size='sm' onClick={onSaveEdit}>Save</Button>
                <Button size='sm' variant='ghost' onClick={onCancelEdit}>Cancel</Button>
              </div>
            </div>
          ) : (
            <p className='mt-1 text-sm text-slate-700'>{comment.content}</p>
          )}

          {user && !deleted && !isEditing && (
            <div className='mt-2 flex flex-wrap items-center gap-3 text-xs'>
              <button className='inline-flex items-center gap-1 text-slate-600' onClick={() => onVote(1)}><ThumbsUp size={13} />{comment.votes_count || 0}</button>
              <button className='inline-flex items-center gap-1 text-slate-600' onClick={() => onVote(-1)}><ThumbsDown size={13} /></button>
              {canReply && <button className='text-secondary' onClick={onReplyToggle}>Reply</button>}
              {isOwn && <button className='inline-flex items-center gap-1 text-slate-600' onClick={onEdit}><Pencil size={12} />Edit</button>}
              {isOwn && <button className='inline-flex items-center gap-1 text-secondary' onClick={onDelete}><Trash2 size={12} />Delete</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
