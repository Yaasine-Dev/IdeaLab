import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight, BarChart3, CheckCircle2, Lightbulb, MessageSquare,
  Quote, Shield, Sparkles, Target, TrendingUp, Users, Zap,
  FileText, Star, BarChart2, RefreshCw,
} from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { getAdminStats } from '../api/analytics.api'
import IdeaCard from '../components/ideas/IdeaCard'
import { HoverScale, Reveal, Stagger, easePremium, revealVariants } from '../components/motion/Reveal'
import Button from '../components/ui/Button'
import { SkeletonCard } from '../components/ui/Skeleton'
import { useTrending } from '../hooks/useIdeas'
import heroImg from '../assets/hero.png'

/* step images — drop these in src/assets/ */
import step1Img from '../assets/step1.jpg'
import step2Img from '../assets/step2.jpg'
import step3Img from '../assets/step3.webp'
import step4Img from '../assets/step4.jpg'

const fallbackStats = { total_ideas: 120, total_users: 450, total_feedbacks: 1200, avg_sgv: 61.4 }

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Founder, NovaTech', text: 'IdeaLab gave me the structured feedback I needed before spending a single dollar. The SGV score was a game-changer.' },
  { name: 'Marcus L.', role: 'Serial Entrepreneur', text: 'I validated three ideas in one month. The reviewer community is sharp, honest, and incredibly helpful.' },
  { name: 'Amina R.', role: 'Product Manager', text: 'The quality of feedback here is unlike anything I\'ve seen. Real experts, real insights, zero fluff.' },
]

const FEATURES = [
  { icon: Target, title: 'Structured Validation', desc: 'Multi-dimensional scoring across market fit, innovation, feasibility, and ROI — not just gut feelings.' },
  { icon: Users, title: 'Expert Community', desc: 'Get reviewed by vetted entrepreneurs, investors, and domain experts who have built real companies.' },
  { icon: BarChart3, title: 'SGV Analytics', desc: 'Track your Startup Global Validation score over time and benchmark against top-performing ideas.' },
  { icon: Zap, title: 'Fast Turnaround', desc: 'Receive your first feedback within 48 hours. Iterate quickly before committing resources.' },
  { icon: Shield, title: 'Confidential & Safe', desc: 'Your ideas are protected. Share only what you want, with full control over visibility.' },
  { icon: Sparkles, title: 'Actionable Insights', desc: 'Every review comes with specific, actionable recommendations — not vague opinions.' },
]

const LOGOS = ['Y Combinator', 'Techstars', 'Product Hunt', '500 Startups', 'AngelList', 'Crunchbase']

export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  const { data: trendingData = [], isLoading } = useTrending()
  const { data: statsData } = useQuery({
    queryKey: ['admin-stats-public'],
    queryFn: async () => {
      try { const r = await getAdminStats(); return r.data }
      catch { return fallbackStats }
    },
  })

  const stats = statsData || fallbackStats
  const trending = Array.isArray(trendingData?.results) ? trendingData.results : (Array.isArray(trendingData) ? trendingData : [])

  return (
    <div className='overflow-x-hidden'>

      {/* ── HERO ── */}
      <section ref={heroRef} className='relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary/20 px-4 py-20 md:py-28'>
        {/* decorative rings */}
        <div className='pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full border border-secondary/10' />
        <div className='pointer-events-none absolute -right-20 -top-20 h-[360px] w-[360px] rounded-full border border-secondary/15' />
        <div className='pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-secondary/5 blur-3xl' />

        <motion.div style={{ y: heroY }} className='mx-auto flex max-w-6xl items-center gap-12'>
          {/* text */}
          <div className='flex-1'>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easePremium }}
              className='mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary'
            >
              <Sparkles size={12} /> The #1 Idea Validation Platform
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easePremium, delay: 0.05 }}
              className='font-display text-4xl font-black leading-[1.08] tracking-tight text-secondary md:text-6xl lg:text-7xl'
            >
              Validate Your<br />
              <span className='relative inline-block'>
                Startup Idea
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.7, ease: easePremium }}
                  className='absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-secondary/40'
                />
              </span>
              <br />Before You Build
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.15, ease: easePremium }}
              className='mt-6 max-w-lg text-base leading-relaxed text-secondary/75 md:text-lg'
            >
              Get structured, multi-dimensional feedback from a curated community of entrepreneurs and experts. Know if your idea is worth pursuing — before you spend a dollar.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: easePremium }}
              className='mt-8 flex flex-wrap items-center gap-4'
            >
              <Link to='/register'>
                <Button className='group px-7 py-3.5 text-base'>
                  Start Free Today
                  <ArrowRight size={16} className='transition-transform duration-300 group-hover:translate-x-1' />
                </Button>
              </Link>
              <Link to='/explore'>
                <Button variant='ghost' className='px-7 py-3.5 text-base'>
                  Browse Ideas
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45, ease: easePremium }}
              className='mt-8 flex flex-wrap items-center gap-5 text-sm text-secondary/60'
            >
              {['No credit card required', 'Free forever plan', '48h first feedback'].map((t) => (
                <span key={t} className='flex items-center gap-1.5'>
                  <CheckCircle2 size={14} className='text-secondary/50' /> {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* image */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: easePremium }}
            className='hidden shrink-0 md:block md:w-[380px] lg:w-[460px]'
          >
            <div className='relative'>
              <div className='absolute inset-x-8 bottom-0 h-3/4 rounded-full bg-secondary/10 blur-3xl' />
              <div className='absolute inset-x-16 bottom-0 h-1/2 rounded-full bg-primary/60 blur-2xl' />
              <img src={heroImg} alt='Entrepreneur' className='relative z-10 w-full drop-shadow-2xl' />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── TRUSTED BY ── */}
      <Reveal className='border-y border-secondary/15 bg-primary/60 py-6'>
        <div className='mx-auto max-w-6xl px-4'>
          <p className='mb-5 text-center text-xs font-semibold uppercase tracking-widest text-secondary/40'>Trusted by founders from</p>
          <div className='flex flex-wrap items-center justify-center gap-8'>
            {LOGOS.map((name) => (
              <span key={name} className='font-display text-sm font-bold tracking-tight text-secondary/30 transition-all duration-300 hover:text-secondary/60'>
                {name}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── STATS ── */}
      <Stagger className='mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-16 md:grid-cols-4'>
        <StatCard label='Ideas Submitted' value={`${stats.total_ideas}+`} />
        <StatCard label='Active Members' value={`${stats.total_users}+`} />
        <StatCard label='Feedbacks Given' value={`${stats.total_feedbacks}+`} />
        <StatCard label='Avg SGV Score' value={`${stats.avg_sgv}`} />
      </Stagger>

      {/* ── FEATURES BENTO ── */}
      <section className='bg-secondary px-4 py-20'>
        <Reveal className='mx-auto max-w-6xl'>
          <p className='mb-2 text-center text-xs font-semibold uppercase tracking-widest text-primary/50'>Why IdeaLab</p>
          <h2 className='font-display mb-12 text-center text-3xl font-black tracking-tight text-primary md:text-5xl'>
            Everything you need to<br />validate with confidence
          </h2>
          <Stagger className='grid gap-4 md:grid-cols-3'>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={revealVariants}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(187,202,225,0.12)' }}
                transition={{ duration: 0.35, ease: easePremium }}
                className='group rounded-2xl border border-primary/15 bg-primary/8 p-6 backdrop-blur-sm'
              >
                <div className='mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10'>
                  <Icon size={20} className='text-primary' />
                </div>
                <h3 className='font-display mb-2 font-bold tracking-tight text-primary'>{title}</h3>
                <p className='text-sm leading-relaxed text-primary/65'>{desc}</p>
              </motion.div>
            ))}
          </Stagger>
        </Reveal>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className='px-4 py-20'>
        <Reveal className='mx-auto max-w-6xl'>
          <p className='mb-2 text-center text-xs font-semibold uppercase tracking-widest text-secondary/40'>The Process</p>
          <h2 className='font-display mb-14 text-center text-3xl font-black tracking-tight text-secondary md:text-5xl'>
            From idea to insight<br />in three steps
          </h2>
          <div className='relative'>
            {/* connector line */}
            <div className='absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-gradient-to-b from-secondary/30 via-secondary/15 to-transparent md:block' />
            <div className='space-y-6 md:space-y-0'>
              {[
                { n: '01', icon: Lightbulb, title: 'Submit Your Idea', desc: 'Fill in your startup concept — problem, solution, target audience, and business model. Takes under 5 minutes.', side: 'left' },
                { n: '02', icon: MessageSquare, title: 'Receive Expert Feedback', desc: 'Our community of vetted reviewers evaluates your idea across 4 key dimensions and leaves detailed, actionable comments.', side: 'right' },
                { n: '03', icon: TrendingUp, title: 'Track Your SGV Score', desc: 'Your Startup Global Validation score aggregates all feedback into a single benchmark. Iterate, resubmit, and watch it climb.', side: 'left' },
              ].map(({ n, icon: Icon, title, desc, side }) => (
                <Reveal key={n} className={`flex items-center gap-8 md:gap-16 ${side === 'right' ? 'md:flex-row-reverse' : ''}`}>
                  <div className='flex-1 md:text-right' style={side === 'right' ? { textAlign: 'left' } : {}}>
                    <span className='font-display text-6xl font-black text-secondary/10'>{n}</span>
                    <h3 className='font-display -mt-3 text-xl font-bold tracking-tight text-secondary'>{title}</h3>
                    <p className='mt-2 text-sm leading-relaxed text-secondary/65'>{desc}</p>
                  </div>
                  <div className='relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-secondary bg-primary shadow-[0_8px_24px_rgba(104,26,21,0.15)]'>
                    <Icon size={24} className='text-secondary' />
                  </div>
                  <div className='flex-1 hidden md:block' />
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className='bg-secondary/5 px-4 py-20'>
        <Reveal className='mx-auto max-w-6xl'>
          <p className='mb-2 text-center text-xs font-semibold uppercase tracking-widest text-secondary/40'>Testimonials</p>
          <h2 className='font-display mb-12 text-center text-3xl font-black tracking-tight text-secondary md:text-5xl'>
            Founders who validated<br />with IdeaLab
          </h2>
          <Stagger className='grid gap-5 md:grid-cols-3'>
            {TESTIMONIALS.map(({ name, role, text }) => (
              <motion.div
                key={name}
                variants={revealVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.35, ease: easePremium }}
                className='relative rounded-2xl border border-secondary/20 bg-primary p-6 shadow-sm'
              >
                <Quote size={28} className='mb-4 text-secondary/20' />
                <p className='text-sm leading-relaxed text-secondary/80'>"{text}"</p>
                <div className='mt-5 flex items-center gap-3'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-bold text-primary text-xs'>
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-secondary'>{name}</p>
                    <p className='text-xs text-secondary/55'>{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </Stagger>
        </Reveal>
      </section>

      {/* ── VALIDATION JOURNEY ── */}
      <div className='bg-primary px-4 pt-20 pb-4'>
        <Reveal className='mx-auto max-w-6xl'>
          <p className='mb-2 text-center text-xs font-semibold uppercase tracking-widest text-secondary/40'>The Journey</p>
          <h2 className='font-display text-center text-3xl font-black tracking-tight text-secondary md:text-5xl'>
            Your idea validation<br />journey, step by step
          </h2>
          <p className='mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-secondary/55'>
            Scroll through each phase — from raw concept to a validated, investor-ready idea.
          </p>
        </Reveal>
      </div>
      <ValidationJourney />

      {/* ── TRENDING IDEAS ── */}
      <section className='px-4 py-20'>
        <Reveal className='mx-auto max-w-6xl'>
          <div className='mb-10 flex items-end justify-between'>
            <div>
              <p className='mb-1 text-xs font-semibold uppercase tracking-widest text-secondary/40'>Community</p>
              <h2 className='font-display text-3xl font-black tracking-tight text-secondary md:text-4xl'>Trending This Week</h2>
            </div>
            <Link to='/explore'>
              <Button variant='secondary' className='hidden items-center gap-1 md:flex'>
                View all <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <div className='grid gap-4 md:grid-cols-3'>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <Stagger className='grid gap-4 md:grid-cols-3'>
              {trending.slice(0, 6).map((idea) => (
                <motion.div key={idea.id} variants={revealVariants}>
                  <HoverScale><IdeaCard idea={idea} /></HoverScale>
                </motion.div>
              ))}
            </Stagger>
          )}
        </Reveal>
      </section>

      {/* ── CTA BANNER ── */}
      <section className='px-4 pb-20'>
        <Reveal className='mx-auto max-w-6xl'>
          <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.45, ease: easePremium }}
            className='relative overflow-hidden rounded-3xl bg-secondary px-8 py-16 text-center md:px-16'
          >
            {/* decorative circles */}
            <div className='pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary/8' />
            <div className='pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-primary/8' />
            <div className='pointer-events-none absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent' />

            <p className='mb-3 text-xs font-semibold uppercase tracking-widest text-primary/50'>Get started today</p>
            <h2 className='font-display text-3xl font-black tracking-tight text-primary md:text-5xl'>
              Your next big idea<br />deserves real validation
            </h2>
            <p className='mx-auto mt-4 max-w-xl text-base text-primary/70'>
              Join thousands of entrepreneurs who stopped guessing and started building with confidence.
            </p>
            <div className='mt-8 flex flex-wrap justify-center gap-4'>
              <Link to='/register'>
                <motion.button
                  whileHover={{ backgroundColor: '#681A15', color: '#BBCAE1', borderColor: '#681A15' }}
                  transition={{ duration: 0.25 }}
                  onClick={() => window.location.href = '/register'}
                  className='group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary/60 bg-primary px-8 py-3.5 text-base font-semibold text-secondary shadow-[0_8px_24px_rgba(187,202,225,0.25)]'
                >
                  Join IdeaLab Free
                  <ArrowRight size={16} className='transition-transform duration-300 group-hover:translate-x-1' />
                </motion.button>
              </Link>
              <Link to='/explore'>
                <motion.button
                  whileHover={{ backgroundColor: '#BBCAE1', color: '#681A15', borderColor: '#BBCAE1' }}
                  transition={{ duration: 0.25 }}
                  onClick={() => window.location.href = '/explore'}
                  className='inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary/60 bg-transparent px-8 py-3.5 text-base font-semibold text-primary'
                >
                  Explore Ideas
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </Reveal>
      </section>

    </div>
  )
}

const STEPS = [
  {
    n: '01', icon: FileText, label: 'Submit', img: step1Img,
    title: 'Craft Your Idea Brief',
    desc: 'Fill in your startup concept in under 5 minutes — problem statement, proposed solution, target audience, and business model. Our structured template ensures reviewers have everything they need.',
    tags: ['Problem Statement', 'Solution', 'Target Market', 'Business Model'],
    stat: { value: '5 min', label: 'to submit' },
  },
  {
    n: '02', icon: Users, label: 'Review', img: step2Img,
    title: 'Get Matched With Experts',
    desc: 'Your idea is surfaced to vetted reviewers — entrepreneurs, investors, and domain experts. Each reviewer scores your idea across 4 dimensions: Market Fit, Innovation, Feasibility, and ROI potential.',
    tags: ['Market Fit', 'Innovation', 'Feasibility', 'ROI Potential'],
    stat: { value: '48h', label: 'first review' },
  },
  {
    n: '03', icon: BarChart2, label: 'Score', img: step3Img,
    title: 'Receive Your SGV Score',
    desc: 'All feedback is aggregated into your Startup Global Validation score — a single benchmark from 0 to 100. See exactly where your idea excels and where it needs work, broken down by dimension.',
    tags: ['SGV Score', 'Dimension Breakdown', 'Benchmark', 'Percentile Rank'],
    stat: { value: '81', label: 'avg SGV score' },
  },
  {
    n: '04', icon: RefreshCw, label: 'Iterate', img: step4Img,
    title: 'Iterate & Revalidate',
    desc: 'Use the detailed feedback to refine your idea. Update your brief, address the weak dimensions, and resubmit. Track your SGV score over time as your idea evolves from concept to conviction.',
    tags: ['Actionable Feedback', 'Version History', 'Score Tracking', 'Community Q&A'],
    stat: { value: '+39pts', label: 'per iteration' },
  },
]

function StepRow({ step, index }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'start 20%'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 18 })

  /* image animations */
  const imgX     = useTransform(smooth, [0, 1], [index % 2 === 0 ? 80 : -80, 0])
  const imgOpacity = useTransform(smooth, [0, 0.4], [0, 1])
  const imgScale  = useTransform(smooth, [0, 1], [0.88, 1])
  const imgRotate = useTransform(smooth, [0, 1], [index % 2 === 0 ? 4 : -4, 0])

  /* text animations */
  const txtX      = useTransform(smooth, [0, 1], [index % 2 === 0 ? -60 : 60, 0])
  const txtOpacity = useTransform(smooth, [0, 0.5], [0, 1])

  const isEven = index % 2 === 0
  const Icon = step.icon

  return (
    <div ref={ref} className={`flex flex-col items-center gap-10 py-20 md:flex-row md:gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}>

      {/* IMAGE */}
      <motion.div
        style={{ x: imgX, opacity: imgOpacity, scale: imgScale, rotate: imgRotate }}
        className='relative w-full md:w-1/2'
      >
        {/* glow */}
        <div className='absolute inset-x-8 bottom-0 h-2/3 rounded-full bg-secondary/12 blur-3xl' />
        {/* number watermark */}
        <span className={`pointer-events-none absolute -top-8 font-display text-[120px] font-black leading-none text-secondary/6 select-none ${isEven ? '-left-4' : '-right-4'}`}>
          {step.n}
        </span>
        {/* image */}
        <div className='relative overflow-hidden rounded-3xl shadow-[0_32px_64px_rgba(104,26,21,0.18)]'>
          <img
            src={step.img}
            alt={step.title}
            className='h-[380px] w-full object-cover md:h-[440px]'
          />
          {/* overlay gradient */}
          <div className='absolute inset-0 bg-gradient-to-t from-secondary/50 via-transparent to-transparent' />
          {/* stat badge */}
          <div className='absolute bottom-5 left-5 rounded-2xl border border-primary/20 bg-secondary/80 px-4 py-2.5 backdrop-blur-sm'>
            <p className='font-display text-2xl font-black text-primary'>{step.stat.value}</p>
            <p className='text-xs text-primary/55'>{step.stat.label}</p>
          </div>
        </div>
      </motion.div>

      {/* TEXT */}
      <motion.div
        style={{ x: txtX, opacity: txtOpacity }}
        className='w-full md:w-1/2'
      >
        {/* step label */}
        <div className='mb-4 flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl border-2 border-secondary bg-primary shadow-[0_4px_16px_rgba(104,26,21,0.15)]'>
            <Icon size={18} className='text-secondary' />
          </div>
          <span className='text-xs font-bold uppercase tracking-widest text-secondary/45'>Step {step.n} · {step.label}</span>
        </div>

        <h3 className='font-display text-3xl font-black leading-tight tracking-tight text-secondary md:text-4xl'>
          {step.title}
        </h3>
        <p className='mt-4 text-base leading-relaxed text-secondary/60'>{step.desc}</p>

        {/* tags */}
        <div className='mt-6 flex flex-wrap gap-2'>
          {step.tags.map((tag) => (
            <span
              key={tag}
              className='rounded-full border border-secondary/20 bg-secondary/6 px-3.5 py-1.5 text-xs font-semibold text-secondary/65'
            >
              {tag}
            </span>
          ))}
        </div>

        {/* connector to next */}
        {index < STEPS.length - 1 && (
          <div className='mt-8 flex items-center gap-2 text-xs text-secondary/30'>
            <div className='h-px flex-1 bg-secondary/15' />
            <span className='font-semibold uppercase tracking-widest'>Next step</span>
            <div className='h-px flex-1 bg-secondary/15' />
          </div>
        )}
      </motion.div>
    </div>
  )
}

function ValidationJourney() {
  return (
    <section className='bg-primary px-4 pb-20'>
      <div className='mx-auto max-w-6xl divide-y divide-secondary/8'>
        {STEPS.map((step, i) => (
          <StepRow key={step.n} step={step} index={i} />
        ))}
      </div>
    </section>
  )
}

function StatCard({ label, value }) {
  return (
    <motion.div
      variants={revealVariants}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.35, ease: easePremium }}
      className='rounded-2xl border border-secondary/20 bg-primary p-6 text-center shadow-sm'
    >
      <p className='font-display text-3xl font-black text-secondary'>{value}</p>
      <p className='mt-1 text-xs font-medium uppercase tracking-wider text-secondary/50'>{label}</p>
    </motion.div>
  )
}
