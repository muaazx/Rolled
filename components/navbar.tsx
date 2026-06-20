"use client"

import { getCompany } from "@/lib/data"
import { Bell, Search, User as UserIcon, LogOut } from "lucide-react"
import { useAuth } from "@/components/providers/AuthProvider"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"

export function Navbar() {
 const { user } = useAuth()
 const company = getCompany()
 const router = useRouter()

 const handleLogout = async () => {
   await signOut(auth)
   router.push('/login')
 }

 if (!user) return null;

 return (
 <header className="h-20 shadow-sm bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
 <div className="flex items-center gap-4 hidden md:flex">
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
 <input type="text" placeholder="Search invoices, employees..." className="pl-10 pr-4 py-2 text-sm rounded-xl border border-[#E0E0EB] bg-[#F8F9FB] focus:outline-none focus:ring-2 focus:ring-primary focus:ransparent text-[#1C1C2E] w-72 transition-all"
 />
 </div>
 </div>
 {/* Mobile placeholder to push things right */}
 <div className="md:hidden"></div>

 <div className="flex items-center gap-6">
 {/* Company switch indicator */}
 <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#EBE8FC] text-[#8A4FFF] rounded-lg text-sm font-semibold">
 <BuildingIcon />
 <span>{company.name}</span>
 </div>

 <button className="relative text-gray-500 hover:text-gray-900 transition-colors">
 <Bell size={20} />
 <span className="absolute top-0 right-0 w-2 h-2 bg-[#FF7675] rounded-full border-2 border-white"></span>
 </button>

 <div className="flex items-center gap-3 border-l border-[#F0F0F5] pl-6">
 <div className="text-right hidden sm:block">
 <div className="text-sm font-semibold">{user.displayName || user.email}</div>
 </div>
 <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-medium shadow-sm">
 {user.displayName ? user.displayName[0] : (user.email ? user.email[0].toUpperCase() : 'U')}
 </div>
 <button onClick={handleLogout} className="ml-4 text-gray-500 hover:text-red-500 transition-colors p-2">
  <LogOut size={18} />
 </button>
 </div>
 </div>
 </header>
 )
}

function BuildingIcon() {
 return (
 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
 <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
 <path d="M9 22v-4h6v4"></path>
 <path d="M8 6h.01"></path>
 <path d="M16 6h.01"></path>
 <path d="M12 6h.01"></path>
 <path d="M12 10h.01"></path>
 <path d="M12 14h.01"></path>
 <path d="M16 10h.01"></path>
 <path d="M16 14h.01"></path>
 <path d="M8 10h.01"></path>
 <path d="M8 14h.01"></path>
 </svg>
 )
}
