import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lightbulb, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { useLogin } from '../hooks/useAuth'
import loginChar from '../assets/login-char.png'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ease = [0.22, 1, 0.36, 1]

const PERKS = [
  'Get feedback from vetted experts',
  'Track your SGV score over time',
  'Join 450+ active founders',
]

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm()
  const loginMutation = useLogin()

  const onSubmit = (values) => {
    setApiError('')
    loginMutation.mutate(values, {
      onError: (err) => setApiError(err?.response?.data?.detail || 'Invalid credentials'),
    })
  }

  return (
    <div className='flex h-[calc(100vh-64px)]'>

      {/* ── LEFT BRAND PANEL ── */}
      <div className='relative hidden flex-col justify-between overflow-hidden bg-secondary px-12 py-16 lg:flex lg:w-[45%] h-full'>
        {/* decorative rings */}
        <div className='pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full border border-primary/10' />
        <div className='pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full border border-primary/15' />
        <div className='pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full border border-primary/10' />
        <div className='pointer-events-none absolute bottom-32 right-0 h-48 w-48 rounded-full bg-primary/5 blur-3xl' />

        {/* logo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className='flex items-center gap-2'
        >
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15'>
            <Lightbulb size={18} className='text-primary' />
          </div>
          <span className='font-display text-xl font-black tracking-tight text-primary'>IdeaLab</span>
        </motion.div>

        {/* headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease }}
        >
          <p className='mb-3 text-xs font-semibold uppercase tracking-widest text-primary/40'>Welcome back</p>
          <h2 className='font-display text-4xl font-black leading-tight tracking-tight text-primary'>
            Your next big<br />idea is waiting.
          </h2>
          <p className='mt-4 text-sm leading-relaxed text-primary/60'>
            Sign in to access your dashboard, track your validation scores, and connect with the community.
          </p>
          <ul className='mt-8 space-y-3'>
            {PERKS.map((p) => (
              <li key={p} className='flex items-center gap-3 text-sm text-primary/70'>
                <CheckCircle2 size={15} className='shrink-0 text-primary/50' />
                {p}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* bottom quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className='rounded-2xl border border-primary/15 bg-primary/8 p-5'
        >
          <p className='text-sm italic leading-relaxed text-primary/65'>
            "IdeaLab helped me validate my SaaS idea in 3 days. The feedback was sharper than any accelerator I've been to."
          </p>
          <div className='mt-3 flex items-center gap-2'>
            <div className='flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary'>JM</div>
            <div>
              <p className='text-xs font-semibold text-primary/80'>James M.</p>
              <p className='text-xs text-primary/45'>Founder, Stackly</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className='flex flex-1 h-full items-center justify-center overflow-y-auto bg-primary px-6 py-16'>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease }}
          className='w-full max-w-md'
        >
          {/* mobile logo */}
          <div className='mb-8 flex items-center gap-2 lg:hidden'>
            <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/15'>
              <Lightbulb size={16} className='text-secondary' />
            </div>
            <span className='font-display text-lg font-black tracking-tight text-secondary'>IdeaLab</span>
          </div>

          <div className='mb-1 inline-flex items-center gap-1.5 rounded-full border border-secondary/20 bg-secondary/8 px-3 py-1 text-xs font-semibold text-secondary/60'>
            <Sparkles size={11} /> Sign in to your account
          </div>
          <div className='mt-3 flex items-center justify-between gap-3'>
            <h1 className='font-display text-6xl font-black leading-tight tracking-tight text-secondary'>WELCOME! </h1>
            <img
              src={loginChar}
              alt=''
              style={{ height: '160px', width: '160px' }}
              className='shrink-0 object-contain drop-shadow-xl'
            />
          </div>
          <p className='mt-2 text-sm text-secondary/55'>Don't have an account? <Link to='/register' className='font-semibold text-secondary underline-offset-2 hover:underline'>Create one free</Link></p>

          <form onSubmit={handleSubmit(onSubmit)} className='mt-8 space-y-5'>
            <Field label='Username' error={errors.username?.message}>
              <input
                {...register('username', {
                  required: 'Username is required',
                })}
                placeholder='your username'
                className='input-premium'
              />
            </Field>

            <Field label='Password' error={errors.password?.message}>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters' },
                  })}
                  placeholder='••••••••'
                  className='input-premium pr-11'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((v) => !v)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary/70'
                  aria-label='Toggle password'
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </Field>

            {apiError && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className='rounded-lg border border-secondary/20 bg-secondary/8 px-4 py-2.5 text-sm text-secondary'
              >
                {apiError}
              </motion.p>
            )}

            <Button type='submit' loading={loginMutation.isPending} className='group w-full py-3 text-base'>
              Sign in
              <ArrowRight size={16} className='transition-transform duration-300 group-hover:translate-x-1' />
            </Button>
          </form>

          <p className='mt-8 text-center text-xs text-secondary/35'>
            By signing in you agree to our{' '}
            <span className='cursor-pointer underline-offset-2 hover:underline'>Terms</span> &amp;{' '}
            <span className='cursor-pointer underline-offset-2 hover:underline'>Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className='mb-1.5 block text-sm font-semibold text-secondary/80'>{label}</label>
      {children}
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className='mt-1.5 text-xs text-secondary/70'>
          {error}
        </motion.p>
      )}
    </div>
  )
}
