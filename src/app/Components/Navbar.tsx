"use client"
import Link from 'next/link'
import { ConnectButton } from 'thirdweb/react'
import { client } from '../client'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Navbar() {
  const owner = "0x09D9a6EdfE066fc24F46bA8C2b21736468f2967D"
  const {address} = useAccount();
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-10"
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex items-center justify-between py-4 bg-black/80 backdrop-filter backdrop-blur-lg rounded-b-lg w-4/5 mx-auto px-10 border-b border-blue-500/20"
          whileHover={{ borderColor: "rgba(59, 130, 246, 0.5)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-bold text-xl'>
              FortiFi
            </Link>
          </motion.div>
          <div className="flex items-center space-x-6">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/pools">Pools</NavLink>
            {address == owner ?
            <>
              <NavLink href="/createPolicy">Create Policy</NavLink>
              <NavLink href="/verifypolicy">Verify Claims</NavLink>
            </>:
            <>
              <NavLink href="/claimpolicy">Claim Policy</NavLink>
            </>
            }
            <NavLink href="/mypolicies">My Policies</NavLink>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <appkit-button/>
          </motion.div>
        </motion.div>
      </div>
    </motion.nav>
  )
}

function NavLink({ href, children }:{href:string,children:string}) {
  const pathName = usePathname();
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link 
        href={href} 
        className={`relative group transition-all duration-300 ${
          pathName === href 
            ? "text-blue-400 font-bold" 
            : "text-gray-300 hover:text-blue-400"
        }`}
      >
        {children}
        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full ${
          pathName === href ? "w-full" : ""
        }`}></span>
      </Link>
    </motion.div>
  )
}