import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Award, Calendar, Camera, Check, Lightbulb,
  MessageSquare, Pencil, Shield, Star, Upload, X,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getMyReviews } from '../api/feedbacks.api'
import { getIdeas } from '../api/ideas.api'
import { getUserProfile, updateMyProfile } from '../api/users.api'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import useAuthStore from '../store/authStore'
import { formatDate, timeAgo } from '../utils/helpers'

const ease = [0.22, 1, 0.36, 1]

const LEVEL_CONFIG = {
  Bronze: { style: 'border-secondary/25 bg-secondary/8 text-secondary/60',  next: 'Silver', max: 50  },
  Silver: { style: 'border-secondary/40 bg-secondary/15 text-secondary/75', next: 'Gold',   max: 150 },
  Gold:   { style: 'border-secondary/60 bg-secondary/25 text-secondary',    next: 'Expert', max: 300 },
  Expert: { style: 'border-secondary bg-secondary text-primary',            next: null,     max: 300 },
}

const STATUS_STYLES = {
  draft:     'bg-secondary/8 text-secondary/50 border-secondary/15',
  submitted: 'bg-secondary/15 text-secondary/70 border-secondary/25',
  review:    'bg-secondary/25 text-secondary border-secondary/35',
  validated: 'bg-secondary text-primary border-secondary',
  rejected:  'bg-secondary/8 text-secondary/40 border-secondary/15',
}

export default function Profile() {
  const { username } = useParams()
  const me = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)
  const queryClient = useQueryClient()
  const toast = useToast()
  const [tab, setTab] = useState('about')
  const [editOpen, setEditOpen] = useState(false)

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', username],
    queryFn: () => getUserProfile(username).then((r) => r.data),
  })

  const isOwn = me?.username === username

  const { data: ideas = [] } = useQuery({
    queryKey: ['profile-ideas', username],
    queryFn: async () => {
      const res = await getIdeas({ owner: username })
      return Array.isArray(res.data?.results) ? res.data.results : (Array.isArray(res.data) ? res.data : [])
    },
    enabled: !!user && user.role === 'entrepreneur',
  })

  const { data: feedbacks = [] } = useQuery({
    queryKey: ['profile-feedbacks', username],
    queryFn: () => getMyReviews().then((r) => Array.isArray(r.data) ? r.data : []),
    enabled: !!user && user.role === 'reviewer' && isOwn,
  })

  // all hooks before early returns
  const level = user?.level || 'Bronze'
  const levelCfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.Bronze
  const rep = user?.reputation_points || 0
  const repProgress = Math.min((rep / levelCfg.max) * 100, 100)
  const fullName = user ? (user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username) : ''

  if (isLoading) return <ProfileSkeleton />
  if (!user) return (
    <div className='flex min-h-screen items-center justify-center bg-primary'>
      <EmptyState title='User not found' description='This profile does not exist.' />
    </div>
  )

  const tabs = [
    { key: 'about', label: 'About' },
    ...(user.role === 'entrepreneur' ? [{ key: 'ideas', label: `Ideas${ideas.length ? ` (${ideas.length})` : ''}` }] : []),
    ...(user.role === 'reviewer' && isOwn ? [{ key: 'feedbacks', label: `Reviews${feedbacks.length ? ` (${feedbacks.length})` : ''}` }] : []),
  ]

  return (
    <div className='min-h-screen bg-primary'>

      {/* ── COVER BANNER ── */}
      <div className='relative h-52 overflow-hidden bg-secondary'>
        <div className='pointer-events-none absolute inset-0'>
          <div className='absolute -right-32 -top-32 h-96 w-96 rounded-full border border-primary/8' />
          <div className='absolute -left-16 -top-16 h-64 w-64 rounded-full border border-primary/6' />
          <div className='absolute bottom-0 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl' />
        </div>
        {/* cover pattern */}
        <div className='absolute inset-0 opacity-5' style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(187,202,225,0.4) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
      </div>

      <div className='mx-auto max-w-5xl px-6'>

        {/* ── PROFILE HEADER ── */}
        <div className='-mt-16 mb-8 flex flex-wrap items-end justify-between gap-6'>
          <div className='flex items-end gap-5'>
            {/* Avatar with upload overlay for own profile */}
            <div className='group relative'>
              <div className='rounded-2xl border-4 border-primary shadow-[0_12px_40px_rgba(104,26,21,0.20)] overflow-hidden'>
                <AvatarDisplay src={user.avatar} username={user.username} size={80} />
              </div>
              {isOwn && (
                <button
                  onClick={() => setEditOpen(true)}
                  className='absolute inset-0 flex items-center justify-center rounded-2xl bg-secondary/60 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100'
                >
                  <Camera size={20} className='text-primary' />
                </button>
              )}
            </div>

            <div className='mb-1 space-y-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <h1 className='font-display text-2xl font-black tracking-tight text-secondary'>{fullName}</h1>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${levelCfg.style}`}>
                  <Award size={10} /> {level}
                </span>
              </div>
              <p className='text-sm text-secondary/45'>@{user.username}</p>
              <div className='flex flex-wrap items-center gap-2 pt-0.5'>
                <span className='inline-flex items-center gap-1 rounded-full border border-secondary/15 bg-secondary/5 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-secondary/55'>
                  <Shield size={10} /> {user.role}
                </span>
                {user.speciality && (
                  <span className='rounded-full border border-secondary/15 bg-secondary/5 px-2.5 py-0.5 text-[11px] font-semibold text-secondary/55'>
                    {user.speciality}
                  </span>
                )}
              </div>
            </div>
          </div>

          {isOwn && (
            <Button size='sm' variant='secondary' onClick={() => setEditOpen(true)}>
              <Pencil size={13} /> Edit Profile
            </Button>
          )}
        </div>

        {/* ── STATS ROW ── */}
        <div className='mb-8 grid grid-cols-3 gap-3 sm:grid-cols-3'>
          {[
            { icon: Lightbulb,     label: 'Ideas',      value: ideas.length,    show: user.role === 'entrepreneur' },
            { icon: MessageSquare, label: 'Reviews',    value: feedbacks.length, show: user.role === 'reviewer' },
            { icon: Star,          label: 'Reputation', value: rep,             show: true },
            { icon: Calendar,      label: 'Member',     value: formatDate(user.date_joined || new Date().toISOString()), show: true, small: true },
          ].filter((s) => s.show).slice(0, 3).map(({ icon: Icon, label, value, small }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className='rounded-2xl border border-secondary/12 bg-primary p-4 text-center shadow-[0_4px_20px_rgba(104,26,21,0.05)]'
            >
              <Icon size={14} className='mx-auto mb-2 text-secondary/35' />
              <p className={`font-display font-black text-secondary ${small ? 'text-sm' : 'text-2xl'}`}>{value}</p>
              <p className='mt-0.5 text-[11px] text-secondary/40'>{label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div className='mb-6 flex gap-1 rounded-xl border border-secondary/12 bg-secondary/4 p-1'>
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                tab === key
                  ? 'bg-secondary text-primary shadow-[0_4px_12px_rgba(104,26,21,0.18)]'
                  : 'text-secondary/45 hover:text-secondary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease }}
            className='pb-16'
          >

            {/* ABOUT TAB */}
            {tab === 'about' && (
              <div className='grid gap-4 lg:grid-cols-3'>
                {/* Bio + details */}
                <div className='space-y-4 lg:col-span-2'>
                  <div className='rounded-2xl border border-secondary/12 bg-primary p-6 shadow-[0_4px_20px_rgba(104,26,21,0.05)]'>
                    <p className='mb-3 text-[10px] font-bold uppercase tracking-widest text-secondary/30'>About</p>
                    <p className='text-sm leading-relaxed text-secondary/65'>
                      {user.bio || <span className='italic text-secondary/30'>No bio yet{isOwn ? ' — click Edit Profile to add one' : ''}.</span>}
                    </p>
                  </div>

                  <div className='rounded-2xl border border-secondary/12 bg-primary p-6 shadow-[0_4px_20px_rgba(104,26,21,0.05)]'>
                    <p className='mb-4 text-[10px] font-bold uppercase tracking-widest text-secondary/30'>Details</p>
                    <div className='space-y-3'>
                      {[
                        { label: 'Role',       value: user.role,       icon: Shield },
                        { label: 'Speciality', value: user.speciality, icon: Star },
                        { label: 'Joined',     value: formatDate(user.date_joined || new Date().toISOString()), icon: Calendar },
                      ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className='flex items-center gap-3'>
                          <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-secondary/12 bg-secondary/5'>
                            <Icon size={13} className='text-secondary/40' />
                          </div>
                          <div>
                            <p className='text-[10px] font-bold uppercase tracking-wider text-secondary/30'>{label}</p>
                            <p className='text-sm capitalize text-secondary/70'>{value || 'Not set'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reputation card */}
                <div className='space-y-4'>
                  <div className='rounded-2xl border border-secondary/12 bg-primary p-6 shadow-[0_4px_20px_rgba(104,26,21,0.05)]'>
                    <p className='mb-4 text-[10px] font-bold uppercase tracking-widest text-secondary/30'>Reputation</p>
                    <div className='mb-4 text-center'>
                      <p className='font-display text-4xl font-black text-secondary'>{rep}</p>
                      <p className='text-xs text-secondary/40'>points</p>
                    </div>
                    <div className='mb-2 flex items-center justify-between text-xs'>
                      <span className={`rounded-full border px-2 py-0.5 font-bold ${levelCfg.style}`}>{level}</span>
                      {levelCfg.next && <span className='text-secondary/35'>{levelCfg.next} →</span>}
                    </div>
                    <div className='h-2 overflow-hidden rounded-full bg-secondary/10'>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${repProgress}%` }}
                        transition={{ duration: 1.2, ease }}
                        className='h-2 rounded-full bg-secondary'
                      />
                    </div>
                    <p className='mt-2 text-center text-xs text-secondary/35'>
                      {levelCfg.next ? `${levelCfg.max - rep} pts to ${levelCfg.next}` : 'Max level reached 🎉'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* IDEAS TAB */}
            {tab === 'ideas' && (
              ideas.length ? (
                <div className='grid gap-4 sm:grid-cols-2'>
                  {ideas.map((idea, i) => (
                    <motion.div
                      key={idea.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05, ease }}
                      className='group rounded-2xl border border-secondary/12 bg-primary p-5 shadow-[0_4px_16px_rgba(104,26,21,0.05)] transition-shadow hover:shadow-[0_8px_32px_rgba(104,26,21,0.10)]'
                    >
                      <div className='mb-3 flex items-center gap-2'>
                        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLES[idea.status] || STATUS_STYLES.draft}`}>
                          {idea.status}
                        </span>
                        {idea.sector && <span className='text-[11px] text-secondary/35'>{idea.sector}</span>}
                        {(idea.global_score > 0 || idea.sgv_score > 0) && (
                          <span className='ml-auto font-display text-sm font-black text-secondary'>
                            {idea.global_score || idea.sgv_score}<span className='text-xs text-secondary/30'>/10</span>
                          </span>
                        )}
                      </div>
                      <Link to={`/ideas/${idea.id}`} className='block'>
                        <h3 className='font-display font-bold text-secondary transition-colors group-hover:text-secondary/75 line-clamp-2'>
                          {idea.title}
                        </h3>
                        <p className='mt-1.5 text-xs leading-relaxed text-secondary/45 line-clamp-2'>{idea.description}</p>
                      </Link>
                      <p className='mt-3 text-[11px] text-secondary/30'>{timeAgo(idea.created_at)}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Lightbulb} title='No ideas yet' description='This entrepreneur has not submitted any ideas.' />
              )
            )}

            {/* FEEDBACKS TAB */}
            {tab === 'feedbacks' && (
              feedbacks.length ? (
                <div className='space-y-3'>
                  {feedbacks.map((f, i) => (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04, ease }}
                      className='rounded-2xl border border-secondary/12 bg-primary p-5 shadow-[0_4px_16px_rgba(104,26,21,0.05)]'
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <Link to={`/ideas/${f.idea?.id}`} className='font-semibold text-secondary hover:underline underline-offset-2 line-clamp-1'>
                          {f.idea?.title || 'Idea'}
                        </Link>
                        <span className='shrink-0 font-display text-xl font-black text-secondary'>
                          {f.weighted_score?.toFixed(1) || 0}<span className='text-xs text-secondary/30'>/10</span>
                        </span>
                      </div>
                      <div className='mt-3 grid grid-cols-4 gap-2'>
                        {[
                          { label: 'Market',      val: f.market_score },
                          { label: 'Innovation',  val: f.innovation_score },
                          { label: 'Feasibility', val: f.feasibility_score },
                          { label: 'ROI',         val: f.roi_score },
                        ].map(({ label, val }) => (
                          <div key={label} className='rounded-lg border border-secondary/10 bg-secondary/4 p-2 text-center'>
                            <p className='text-[10px] text-secondary/35'>{label}</p>
                            <p className='font-display text-sm font-black text-secondary'>{val || 0}</p>
                          </div>
                        ))}
                      </div>
                      {f.comment && <p className='mt-3 text-xs leading-relaxed text-secondary/55 line-clamp-3'>{f.comment}</p>}
                      <p className='mt-2 text-[11px] text-secondary/30'>{timeAgo(f.created_at)}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={MessageSquare} title='No reviews yet' description='Your submitted reviews will appear here.' />
              )
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── EDIT MODAL ── */}
      {isOwn && (
        <EditProfileModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          user={user}
          onSuccess={(updated) => {
            updateUser({ ...me, ...updated })
            queryClient.setQueryData(['user', username], (old) => ({ ...old, ...updated }))
            setEditOpen(false)
            toast.success('Profile updated!')
          }}
        />
      )}
    </div>
  )
}

/* ── AVATAR DISPLAY ── */
function AvatarDisplay({ src, username, size = 64 }) {
  const initials = (username || 'U').slice(0, 2).toUpperCase()
  if (src) return (
    <img src={src} alt={username} className='object-cover' style={{ width: size, height: size }} />
  )
  return (
    <div
      className='flex items-center justify-center bg-secondary font-display font-black text-primary'
      style={{ width: size, height: size, fontSize: size * 0.3 }}
    >
      {initials}
    </div>
  )
}

/* ── EDIT PROFILE MODAL ── */
function EditProfileModal({ isOpen, onClose, user, onSuccess }) {
  const toast = useToast()
  const fileRef = useRef(null)
  const [preview, setPreview] = useState(user?.avatar || null)
  const [file, setFile] = useState(null)
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name:  user?.last_name  || '',
    bio:        user?.bio        || '',
    speciality: user?.speciality || '',
  })

  const mutation = useMutation({
    mutationFn: (fd) => updateMyProfile(fd),
    onSuccess: (res) => onSuccess(res.data),
    onError: (err) => toast.error(err?.response?.data?.detail || 'Could not update profile'),
  })

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(f.type)) { toast.error('Only JPEG, PNG or WebP allowed'); return }
    if (f.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSave = () => {
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (file) fd.append('avatar', file)
    mutation.mutate(fd)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Edit Profile'>
      <div className='space-y-5'>

        {/* Avatar upload */}
        <div className='flex items-center gap-4'>
          <div className='relative shrink-0'>
            <div className='h-16 w-16 overflow-hidden rounded-2xl border-2 border-secondary/20'>
              {preview
                ? <img src={preview} alt='preview' className='h-full w-full object-cover' />
                : <div className='flex h-full w-full items-center justify-center bg-secondary font-display text-xl font-black text-primary'>
                    {(user?.username || 'U').slice(0, 2).toUpperCase()}
                  </div>
              }
            </div>
            {preview && (
              <button
                onClick={() => { setPreview(null); setFile(null) }}
                className='absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-primary shadow'
              >
                <X size={10} />
              </button>
            )}
          </div>
          <div>
            <button
              onClick={() => fileRef.current?.click()}
              className='flex items-center gap-2 rounded-xl border border-secondary/20 px-3 py-2 text-sm font-semibold text-secondary/70 transition-colors hover:border-secondary/40 hover:text-secondary'
            >
              <Upload size={14} /> Upload photo
            </button>
            <p className='mt-1 text-[11px] text-secondary/35'>JPEG, PNG or WebP · max 2MB</p>
            <input ref={fileRef} type='file' accept='image/jpeg,image/png,image/webp' className='hidden' onChange={handleFile} />
          </div>
        </div>

        <div className='h-px bg-secondary/8' />

        {/* Name fields */}
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <label className='mb-1.5 block text-xs font-semibold text-secondary/55'>First name</label>
            <input value={form.first_name} onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))} className='input-premium' placeholder='John' />
          </div>
          <div>
            <label className='mb-1.5 block text-xs font-semibold text-secondary/55'>Last name</label>
            <input value={form.last_name} onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))} className='input-premium' placeholder='Doe' />
          </div>
        </div>

        <div>
          <label className='mb-1.5 block text-xs font-semibold text-secondary/55'>Speciality</label>
          <input value={form.speciality} onChange={(e) => setForm((f) => ({ ...f, speciality: e.target.value }))} className='input-premium' placeholder='e.g. SaaS, Fintech, AI' />
        </div>

        <div>
          <div className='mb-1.5 flex items-center justify-between'>
            <label className='text-xs font-semibold text-secondary/55'>Bio</label>
            <span className='text-[11px] text-secondary/30'>{form.bio.length}/300</span>
          </div>
          <textarea
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value.slice(0, 300) }))}
            rows={3}
            className='input-premium resize-none'
            placeholder='Tell the community about yourself…'
          />
        </div>
      </div>

      <div className='mt-6 flex items-center justify-between'>
        <p className='text-xs text-secondary/30'>Changes are saved immediately</p>
        <div className='flex gap-3'>
          <Button variant='ghost' onClick={onClose}>Cancel</Button>
          <Button loading={mutation.isPending} onClick={handleSave}>
            {mutation.isPending ? 'Saving…' : <><Check size={14} /> Save Changes</>}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

/* ── SKELETON ── */
function ProfileSkeleton() {
  return (
    <div className='min-h-screen bg-primary'>
      <div className='h-52 animate-pulse bg-secondary/15' />
      <div className='mx-auto max-w-5xl px-6'>
        <div className='-mt-16 mb-8 flex items-end gap-5'>
          <div className='h-20 w-20 animate-pulse rounded-2xl bg-secondary/20' />
          <div className='mb-1 space-y-2'>
            <div className='h-6 w-40 animate-pulse rounded-lg bg-secondary/15' />
            <div className='h-4 w-24 animate-pulse rounded-lg bg-secondary/10' />
          </div>
        </div>
        <div className='mb-8 grid grid-cols-3 gap-3'>
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className='h-20 animate-pulse rounded-2xl bg-secondary/10' />)}
        </div>
        <div className='h-10 animate-pulse rounded-xl bg-secondary/10' />
        <div className='mt-4 h-64 animate-pulse rounded-2xl bg-secondary/10' />
      </div>
    </div>
  )
}
