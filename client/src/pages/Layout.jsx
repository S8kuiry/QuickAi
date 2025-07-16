import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useUser,Protect,useClerk } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { Eraser, FileText, Hash, Home, Image, LogOut, Scissors, SquarePen, Users } from 'lucide-react'


const Layout = () => {
  
  const navItems = [
    { to: '/ai', label: 'Dashboard', Icon: Home },
    { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
    { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
    { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
    { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
    { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
    { to: '/ai/review-resume', label: 'Review resume', Icon: FileText },
    { to: '/ai/community', label: 'Community', Icon: Users },
  ]


  const { user } = useUser()
  const location = useLocation()
  const {signOut,openUserProfile} = useClerk()
  const plan = user?.publicMetadata?.plan || "Free"
  const navigate = useNavigate()
  return (
    <div className="min-h-screen fixed inset-x-0 inset-y-0 flex flex-col">
      {/* Top Navbar */}
      <header className="w-full py-3 flex items-center justify-between px-[5rem] bg-white shadow">
        <motion.img whileTap={{ scale: 0.96 }} src="/logo.svg" alt="Logo" className="w-32 sm:w-44" />
        <button onClick={() => navigate('/')} className="cursor-pointer text-white bg-[var(--color-primary)] px-6 py-2 rounded-md">Home</button>
      </header>

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[18rem] border-r border-gray-300 h-full py-10 px-6 overflow-y-auto flex flex-col items-start justify-start relative">
          {/* Sidebar content here */}


          <div className="w-full h-[5rem] flex flex-col items-center justify-center">
            <img src={user?.imageUrl} className='rounded-full w-[4rem] h-[4rem] mb-2'></img>
            <p className='font-bold'>{user?.fullName}</p>
          </div>


          {/*------ links ------------ */}
          <div className="w-full flex flex-col items-center justify-start pt-8">
            {navItems.map((itm) => {
              const isActive = location.pathname === itm.to;
              return (
                <div
                  key={itm.to}
                  onClick={() => navigate(itm.to)}
                  className={`cursor-pointer flex items-center justify-start gap-4 pl-4 w-[93%] py-2 my-1 rounded transition-colors duration-200
        ${isActive ? "bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white" : "text-gray-700 hover:bg-gray-100 "}`}
                >
                  <itm.Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                  <p className={`font-medium ${isActive ? "text-white" : ""}`}>{itm.label}</p>
                </div>
              );
            })}


          </div>
          {/*----------- bottom section ---------------- */}
          <div className="absolute bottom-0 inset-x-0 flex items-center justify-center py-4 px-2 gap-3 
          bg-gray-100/50 border-t border-gray-300/70">
              <img src={user?.imageUrl} className='rounded-full w-[3rem] h-[3rem] mb-2'></img>
              <div onClick={openUserProfile} className="cursor-pointer">
                  <p className='font-bold'>{user?.fullName}</p>
                  <p className='text-gray-500'>{plan}</p>
              </div>
              <LogOut onClick={signOut} style={{color:'gray'}} className='cursor-pointer'/>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-blue-400/10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
