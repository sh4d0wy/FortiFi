// pages/dashboard.js
"use client"
import Head from 'next/head'
import Navbar from '../Components/Navbar'
import PolicyCard from '../Components/PolicyCard'
import { policyType } from '../Components/PolicyCard';
import {useManagerRead} from "../web3/hooks/useManagerRead";
import GetPolicies from '../Components/GetPolicies';
import { motion } from 'framer-motion';

const page = ()=>{
  return (
    <div className="min-h-screen bg-black">
      <Head>
        <title>Dashboard - FortiFi</title>
      </Head>
      <Navbar />
      <main className="container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <motion.h1 
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-8"
            animate={{
              textShadow: "0 0 8px rgba(59, 130, 246, 0.5), 0 0 16px rgba(59, 130, 246, 0.3)"
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            All Policies
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <GetPolicies/>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
export default page;
