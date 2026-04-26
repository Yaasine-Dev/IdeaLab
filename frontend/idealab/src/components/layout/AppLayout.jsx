import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Footer from './Footer'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)

  if (user) {
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
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className='flex-1 overflow-y-auto'
            >
              <Outlet />
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen'>
      <Navbar />
      <AnimatePresence mode='wait'>
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
