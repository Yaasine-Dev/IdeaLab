import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Footer from './Footer'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

// Pages that always use Navbar + Footer regardless of auth state
const PUBLIC_LAYOUT_PATHS = ['/', '/explore', '/login', '/register', '/search']

function isPublicLayout(pathname) {
  if (PUBLIC_LAYOUT_PATHS.includes(pathname)) return true
  if (pathname.startsWith('/ideas/')) return true
  if (pathname.startsWith('/profile/')) return true
  return false
}

export default function AppLayout() {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)

  const useNavbar = !user || isPublicLayout(location.pathname)

  if (useNavbar) {
    return (
      <div className='min-h-screen'>
        <Navbar />
        <AnimatePresence mode='wait'>
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    )
  }

  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar />
      <div className='flex flex-1 flex-col overflow-hidden'>
        <AnimatePresence mode='wait'>
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className='flex-1 overflow-y-auto'
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}
