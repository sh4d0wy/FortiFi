'use client'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Head>
        <title>FortiFi - Secure Your Future</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow container mx-auto px-4 py-16 flex flex-col justify-center mt-32">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4"
            animate={{
              textShadow: "0 0 8px rgba(59, 130, 246, 0.5), 0 0 16px rgba(59, 130, 246, 0.3)"
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            FortiFi
          </motion.h1>
          <motion.p 
            className="text-2xl text-blue-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Secure Your Future with Blockchain Technology
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/dashboard"
              className="inline-block px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-blue-500/50"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <FeatureCard
              title="Decentralized"
              description="Leverage the power of blockchain for transparent and secure insurance policies."
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <FeatureCard
              title="Smart Contracts"
              description="Automate claims processing and payouts with tamper-proof smart contracts."
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <FeatureCard
              title="Low Premiums"
              description="Enjoy competitive rates thanks to our efficient, blockchain-based system."
            />
          </motion.div>
        </div>
      </main>

      <motion.footer 
        className="text-center py-8 text-blue-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <p>&copy; 2024 FortiFi. All rights reserved.</p>
      </motion.footer>
    </div>
  )
}

function FeatureCard({ title, description }:{title:string,description:string}) {
  return (
    <motion.div 
      className="bg-gray-900 p-6 rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)"
      }}
    >
      <h2 className="text-2xl font-semibold text-blue-400 mb-4">{title}</h2>
      <p className="text-blue-300">{description}</p>
    </motion.div>
  )
}