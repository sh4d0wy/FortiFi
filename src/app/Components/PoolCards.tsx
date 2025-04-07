import React from 'react'
import { motion } from 'framer-motion'

export function PoolInfoCard({ title, value }:{title:string,value:string}) {
    return (
      <motion.div 
        className="bg-gray-900 rounded-lg p-6 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)"
        }}
      >
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
          {title}
        </h2>
        <p className="text-3xl text-blue-300">{value}</p>
      </motion.div>
    )
  }