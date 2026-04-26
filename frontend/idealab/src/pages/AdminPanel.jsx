import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3, Lightbulb, MessageSquare, Shield,
  Trash2, Users, ChevronDown, Search, PlusCircle, Pencil,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { getAdminStats } from '../api/analytics.api'
import { getCategoriesList, createCategory, updateCategory, deleteCategory } from '../api/categories.api'
import { deleteIdea, getIdeas, changeIdeaStatus } from '../api/ideas.api'
import { deleteUser, getUsers, toggleUserStatus, updateUserRole } from '../api/users.api'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import { formatDate, timeAgo } from '../utils/helpers'

const ease = [0.22, 1, 0.36, 1]

const TABS = [
  { key: 'overview',   label: 'Overview',   icon: BarChart3 },
  { key: 'users',      label: 'Users',      icon: Users },
  { key: 'ideas',      label: 'Ideas',      icon: Lightbulb },
  { key: 'feedbacks',  label: 'Feedbacks',  icon: MessageSquare },
  { key: 'categories', label: 'Categories', icon: Shield },
]

const STATUS_STYLES = {
  draft:     'bg-secondary/8 text-secondary/50 border-secondary/15',
  submitted: 'bg-secondary/15 text-secondary/70 border-secondary/25',
  review:    'bg-secondary/25 text-secondary border-secondary/35',
  validated: 'bg-secondary text-primary border-secondary',
  rejected:  'bg-secondary/8 text-secondary/40 border-secondary/15',
}

export default function AdminPanel() {
  const [tab, setTab] = useState('overview')

  return (
    <div className='min-h-screen bg-primary'>
      {/* Header */}
      <div className='relative overflow-hidden border-b border-secondary/10 bg-secondary px-8 py-10'>
        <div className='pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-primary/10' />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <p className='mb-1 text-xs font-bold uppercase tracking-widest text-primary/40'>Administration</p>
          <h1 className='font-display text-3xl font-black tracking-tight text-primary'>Admin Panel</h1>
          <p className='mt-1 text-sm text-primary/55'>Manage users, ideas, feedbacks and platform settings.</p>
        </motion.div>
      </div>

      {/* Tab bar */}
      <div className='border-b border-secondary/10 bg-primary px-8'>
        <div className='flex gap-1 overflow-x-auto py-2'>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                tab === key ? 'bg-secondary text-primary' : 'text-secondary/50 hover:bg-secondary/8 hover:text-secondary'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-6 py-8'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
          >
            {tab === 'overview'   && <OverviewTab />}
            {tab === 'users'      && <UsersTab />}
            {tab === 'ideas'      && <IdeasTab />}
            {tab === 'feedbacks'  && <FeedbacksTab />}
            {tab === 'categories' && <CategoriesTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ── OVERVIEW ── */
function OverviewTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => getAdminStats().then((r) => r.data),
  })

  if (isLoading) return <TabSkeleton />

  const statCards = [
    { icon: Users,         label: 'Total Users',     value: data?.total_users     || 0 },
    { icon: Lightbulb,     label: 'Total Ideas',     value: data?.total_ideas     || 0 },
    { icon: MessageSquare, label: 'Total Feedbacks', value: data?.total_feedbacks || 0 },
    { icon: Shield,        label: 'Pending Review',  value: data?.pending_ideas   || 0 },
  ]

  return (
    <div className='space-y-8'>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {statCards.map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07, ease }}
            className='rounded-2xl border border-secondary/12 bg-primary p-5 shadow-[0_4px_24px_rgba(104,26,21,0.06)]'
          >
            <div className='mb-3 flex items-center justify-between'>
              <p className='text-xs font-semibold uppercase tracking-widest text-secondary/35'>{label}</p>
              <div className='flex h-8 w-8 items-center justify-center rounded-xl border border-secondary/12 bg-secondary/5'>
                <Icon size={14} className='text-secondary/50' />
              </div>
            </div>
            <p className='font-display text-3xl font-black text-secondary'>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Ideas by status */}
      {data?.ideas_by_status?.length > 0 && (
        <div className='rounded-2xl border border-secondary/12 bg-primary p-6 shadow-[0_4px_24px_rgba(104,26,21,0.06)]'>
          <h2 className='mb-5 font-display text-base font-bold text-secondary'>Ideas by Status</h2>
          <div className='space-y-3'>
            {data.ideas_by_status.map(({ name, count }) => (
              <div key={name} className='flex items-center gap-3'>
                <span className={`w-24 shrink-0 rounded-full border px-2.5 py-0.5 text-center text-[11px] font-semibold capitalize ${STATUS_STYLES[name] || STATUS_STYLES.draft}`}>{name}</span>
                <div className='flex-1 h-2 rounded-full bg-secondary/10'>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((count / (data.total_ideas || 1)) * 100, 100)}%` }}
                    transition={{ duration: 0.8, ease }}
                    className='h-2 rounded-full bg-secondary'
                  />
                </div>
                <span className='w-8 text-right text-xs font-bold text-secondary'>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent users */}
      <div className='rounded-2xl border border-secondary/12 bg-primary shadow-[0_4px_24px_rgba(104,26,21,0.06)]'>
        <div className='border-b border-secondary/8 px-6 py-4'>
          <h2 className='font-display text-base font-bold text-secondary'>Recent Users</h2>
        </div>
        <div className='divide-y divide-secondary/6'>
          {(data?.recent_users || []).map((u) => (
            <div key={u.id} className='flex items-center justify-between px-6 py-3'>
              <div>
                <p className='text-sm font-semibold text-secondary'>{u.username}</p>
                <p className='text-xs text-secondary/40'>{u.email}</p>
              </div>
              <div className='flex items-center gap-2'>
                <span className='rounded-full border border-secondary/15 bg-secondary/5 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-secondary/60'>{u.role}</span>
                <span className='text-xs text-secondary/35'>{timeAgo(u.date_joined)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── USERS ── */
function UsersTab() {
  const qc = useQueryClient()
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: () => getUsers({ search }).then((r) => r.data),
  })
  const users = Array.isArray(data?.results) ? data.results : (Array.isArray(data) ? data : [])

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: () => { toast.success('Role updated'); qc.invalidateQueries({ queryKey: ['admin-users'] }) },
    onError: () => toast.error('Could not update role'),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, is_active }) => toggleUserStatus(id, is_active),
    onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries({ queryKey: ['admin-users'] }) },
    onError: () => toast.error('Could not update status'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => { toast.success('User deleted'); setConfirmDelete(null); qc.invalidateQueries({ queryKey: ['admin-users'] }) },
    onError: () => toast.error('Could not delete user'),
  })

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-3 rounded-2xl border border-secondary/12 bg-primary px-4 py-3'>
        <Search size={15} className='text-secondary/35' />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search by username or email…'
          className='flex-1 bg-transparent text-sm text-secondary placeholder:text-secondary/35 outline-none'
        />
      </div>

      <div className='rounded-2xl border border-secondary/12 bg-primary shadow-[0_4px_24px_rgba(104,26,21,0.06)]'>
        {isLoading ? <TabSkeleton /> : users.length ? (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[700px] text-sm'>
              <thead>
                <tr className='border-b border-secondary/8'>
                  {['User', 'Email', 'Role', 'Reputation', 'Status', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className='px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-secondary/30'>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    className='border-b border-secondary/6 transition-colors hover:bg-secondary/3 last:border-0'
                  >
                    <td className='px-6 py-3 font-semibold text-secondary'>{u.username}</td>
                    <td className='px-6 py-3 text-secondary/50'>{u.email}</td>
                    <td className='px-6 py-3'>
                      <select
                        value={u.role}
                        onChange={(e) => roleMutation.mutate({ id: u.id, role: e.target.value })}
                        className='rounded-lg border border-secondary/20 bg-primary px-2 py-1 text-xs font-semibold text-secondary outline-none'
                      >
                        <option value='entrepreneur'>Entrepreneur</option>
                        <option value='reviewer'>Reviewer</option>
                        <option value='admin'>Admin</option>
                      </select>
                    </td>
                    <td className='px-6 py-3 font-bold text-secondary'>{u.reputation_points || 0}</td>
                    <td className='px-6 py-3'>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${u.is_active ? 'border-secondary/25 bg-secondary/10 text-secondary' : 'border-secondary/15 bg-secondary/5 text-secondary/40'}`}>
                        {u.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className='px-6 py-3 text-xs text-secondary/40'>{formatDate(u.date_joined)}</td>
                    <td className='px-6 py-3'>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => statusMutation.mutate({ id: u.id, is_active: !u.is_active })}
                          className='rounded-lg border border-secondary/20 px-2.5 py-1 text-xs font-semibold text-secondary/60 transition-colors hover:border-secondary/40 hover:text-secondary'
                        >
                          {u.is_active ? 'Suspend' : 'Activate'}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(u)}
                          className='flex h-7 w-7 items-center justify-center rounded-lg border border-secondary/20 text-secondary/40 transition-colors hover:border-secondary/40 hover:text-secondary'
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='p-8'><EmptyState icon={Users} title='No users found' description='Try a different search.' /></div>
        )}
      </div>

      <ConfirmModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title={`Delete ${confirmDelete?.username}?`}
        description='This will permanently delete the user and all their data.'
        onConfirm={() => deleteMutation.mutate(confirmDelete.id)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

/* ── IDEAS ── */
function IdeasTab() {
  const qc = useQueryClient()
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-ideas', search, statusFilter],
    queryFn: () => getIdeas({ search, status: statusFilter || undefined }).then((r) => r.data),
  })
  const ideas = Array.isArray(data?.results) ? data.results : (Array.isArray(data) ? data : [])

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => changeIdeaStatus(id, status),
    onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries({ queryKey: ['admin-ideas'] }) },
    onError: () => toast.error('Could not update status'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteIdea,
    onSuccess: () => { toast.success('Idea deleted'); setConfirmDelete(null); qc.invalidateQueries({ queryKey: ['admin-ideas'] }) },
    onError: () => toast.error('Could not delete idea'),
  })

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex flex-1 items-center gap-3 rounded-2xl border border-secondary/12 bg-primary px-4 py-3'>
          <Search size={15} className='text-secondary/35' />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search ideas…' className='flex-1 bg-transparent text-sm text-secondary placeholder:text-secondary/35 outline-none' />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className='rounded-2xl border border-secondary/12 bg-primary px-4 py-3 text-sm font-semibold text-secondary outline-none'>
          <option value=''>All statuses</option>
          {['draft', 'submitted', 'review', 'validated', 'rejected'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className='rounded-2xl border border-secondary/12 bg-primary shadow-[0_4px_24px_rgba(104,26,21,0.06)]'>
        {isLoading ? <TabSkeleton /> : ideas.length ? (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[800px] text-sm'>
              <thead>
                <tr className='border-b border-secondary/8'>
                  {['Title', 'Owner', 'Status', 'Score', 'Created', 'Actions'].map((h) => (
                    <th key={h} className='px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-secondary/30'>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ideas.map((idea, i) => (
                  <motion.tr key={idea.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: i * 0.03 }}
                    className='border-b border-secondary/6 transition-colors hover:bg-secondary/3 last:border-0'>
                    <td className='px-6 py-3'>
                      <Link to={`/ideas/${idea.id}`} className='font-semibold text-secondary hover:underline underline-offset-2 line-clamp-1'>{idea.title}</Link>
                      <p className='text-xs text-secondary/35'>{idea.sector}</p>
                    </td>
                    <td className='px-6 py-3 text-secondary/60'>{idea.owner?.username}</td>
                    <td className='px-6 py-3'>
                      <select
                        value={idea.status}
                        onChange={(e) => statusMutation.mutate({ id: idea.id, status: e.target.value })}
                        className='rounded-lg border border-secondary/20 bg-primary px-2 py-1 text-xs font-semibold text-secondary outline-none capitalize'
                      >
                        {['submitted', 'review', 'validated', 'rejected'].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className='px-6 py-3 font-display font-black text-secondary'>{idea.global_score || 0}</td>
                    <td className='px-6 py-3 text-xs text-secondary/40'>{formatDate(idea.created_at)}</td>
                    <td className='px-6 py-3'>
                      <button onClick={() => setConfirmDelete(idea)} className='flex h-7 w-7 items-center justify-center rounded-lg border border-secondary/20 text-secondary/40 transition-colors hover:border-secondary/40 hover:text-secondary'>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='p-8'><EmptyState icon={Lightbulb} title='No ideas found' /></div>
        )}
      </div>

      <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title={`Delete "${confirmDelete?.title}"?`} description='This will permanently delete the idea.' onConfirm={() => deleteMutation.mutate(confirmDelete.id)} loading={deleteMutation.isPending} />
    </div>
  )
}

/* ── FEEDBACKS ── */
function FeedbacksTab() {
  const qc = useQueryClient()
  const toast = useToast()
  const [confirmDelete, setConfirmDelete] = useState(null)

  // get all feedbacks via ideas list then aggregate — or use my-reviews for now
  const { data: ideasData } = useQuery({
    queryKey: ['admin-ideas-for-feedbacks'],
    queryFn: () => getIdeas({}).then((r) => r.data),
  })
  const ideas = Array.isArray(ideasData?.results) ? ideasData.results : (Array.isArray(ideasData) ? ideasData : [])

  return (
    <div className='rounded-2xl border border-secondary/12 bg-primary p-8 shadow-[0_4px_24px_rgba(104,26,21,0.06)]'>
      <p className='text-sm text-secondary/60'>
        To manage feedbacks, open an idea from the <strong className='text-secondary'>Ideas</strong> tab and view its feedbacks directly on the idea detail page. Reviewers can edit or delete their own feedbacks there.
      </p>
      <div className='mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {ideas.slice(0, 6).map((idea) => (
          <Link key={idea.id} to={`/ideas/${idea.id}`} className='rounded-xl border border-secondary/12 p-4 transition-colors hover:bg-secondary/5'>
            <p className='font-semibold text-secondary line-clamp-1'>{idea.title}</p>
            <p className='mt-1 text-xs text-secondary/40 capitalize'>{idea.status} · {idea.owner?.username}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

/* ── CATEGORIES ── */
function CategoriesTab() {
  const qc = useQueryClient()
  const toast = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => getCategoriesList().then((r) => r.data),
  })
  const categories = Array.isArray(data?.results) ? data.results : (Array.isArray(data) ? data : [])

  const saveMutation = useMutation({
    mutationFn: (payload) => editing ? updateCategory(editing.id, payload) : createCategory(payload),
    onSuccess: () => {
      toast.success(editing ? 'Category updated' : 'Category created')
      setModalOpen(false); setEditing(null); reset()
      qc.invalidateQueries({ queryKey: ['admin-categories'] })
    },
    onError: () => toast.error('Could not save category'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => { toast.success('Category deleted'); setConfirmDelete(null); qc.invalidateQueries({ queryKey: ['admin-categories'] }) },
    onError: () => toast.error('Could not delete category'),
  })

  const openCreate = () => { setEditing(null); reset({ name: '', slug: '' }); setModalOpen(true) }
  const openEdit = (c) => { setEditing(c); reset({ name: c.name, slug: c.slug }); setModalOpen(true) }

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <Button onClick={openCreate}><PlusCircle size={14} /> New Category</Button>
      </div>

      {isLoading ? <TabSkeleton /> : categories.length ? (
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {categories.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05, ease }}
              className='rounded-2xl border border-secondary/12 bg-primary p-5 shadow-[0_4px_16px_rgba(104,26,21,0.05)]'>
              <div className='mb-3 flex items-start justify-between'>
                <div>
                  <p className='font-display font-bold text-secondary'>{c.name}</p>
                  <p className='text-xs text-secondary/40'>{c.slug}</p>
                </div>
                <div className='flex gap-1.5'>
                  <button onClick={() => openEdit(c)} className='flex h-7 w-7 items-center justify-center rounded-lg border border-secondary/20 text-secondary/40 hover:text-secondary'>
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => setConfirmDelete(c)} className='flex h-7 w-7 items-center justify-center rounded-lg border border-secondary/20 text-secondary/40 hover:text-secondary'>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className='rounded-2xl border border-secondary/12 bg-primary p-8'>
          <EmptyState icon={Shield} title='No categories yet' description='Create your first category.' actionLabel='New Category' onAction={openCreate} />
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'New Category'}>
        <form onSubmit={handleSubmit((v) => saveMutation.mutate({ name: v.name, slug: v.slug || v.name.toLowerCase().replace(/\s+/g, '-') }))} className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-xs font-semibold text-secondary/55'>Name</label>
            <input {...register('name', { required: 'Required' })} className='input-premium' placeholder='e.g. SaaS' />
            {errors.name && <p className='mt-1 text-xs text-secondary/50'>{errors.name.message}</p>}
          </div>
          <div>
            <label className='mb-1.5 block text-xs font-semibold text-secondary/55'>Slug (auto-generated if empty)</label>
            <input {...register('slug')} className='input-premium' placeholder='e.g. saas' />
          </div>
          <div className='flex justify-end gap-3'>
            <Button variant='ghost' type='button' onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type='submit' loading={saveMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title={`Delete "${confirmDelete?.name}"?`} description='All ideas in this category will lose their category.' onConfirm={() => deleteMutation.mutate(confirmDelete.id)} loading={deleteMutation.isPending} />
    </div>
  )
}

/* ── SHARED ── */
function ConfirmModal({ open, onClose, title, description, onConfirm, loading }) {
  return (
    <Modal isOpen={open} onClose={onClose} title={title}>
      <p className='text-sm text-secondary/65'>{description}</p>
      <div className='mt-6 flex justify-end gap-3'>
        <Button variant='ghost' onClick={onClose}>Cancel</Button>
        <Button variant='danger' loading={loading} onClick={onConfirm}>Delete</Button>
      </div>
    </Modal>
  )
}

function TabSkeleton() {
  return (
    <div className='space-y-3 p-6'>
      {Array.from({ length: 5 }).map((_, i) => <div key={i} className='h-12 animate-pulse rounded-xl bg-secondary/8' />)}
    </div>
  )
}
