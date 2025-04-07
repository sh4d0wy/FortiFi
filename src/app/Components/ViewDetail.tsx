"use client"
import React from 'react';
import Head from 'next/head';
import { Shield, DollarSign, Calendar, User, FileText, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useManagerRead } from '../web3/hooks/useManagerRead';
import { policyType } from './PolicyCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Mock data for a policy
const mockPolicy = {
  id: 'POL-123456',
  title: 'DeFi Protocol Coverage',
  description: 'Comprehensive coverage against smart contract vulnerabilities and hacks for decentralized finance protocols.',
  coverageAmount: 100000,
  premium: 5000,
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  policyHolder: '0x1234...5678',
  riskLevel: 'High',
  claimsFiled: 2,
  status: 'Active'
};

const DetailItem = ({ icon, label, value }:any) => (
  <motion.div 
    className="flex items-center mb-4 p-4 bg-gray-800 rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="p-2 bg-blue-900/50 rounded-lg">
      {icon}
    </div>
    <div className="ml-4">
      <p className="text-blue-300 text-sm font-semibold">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  </motion.div>
);

type policyReceived={
    data:policyType
}

export default function ViewDetail({policyId}:{policyId:number}) {
    const {data:policy} = useManagerRead({
        functionName:"policies",
        args:[policyId]
    }) as {data:any[]}

    if(policy==undefined){
        return(<> </>)
    }
    return (
    <div className="min-h-screen bg-black">
      <Head>
        <title>Policy Details - FortiFi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-24">
        <motion.div 
          className='absolute top-30 left-10'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/dashboard">
            <motion.span 
              className='text-blue-300 hover:text-blue-400 flex items-center gap-2 transition-colors duration-300'
              whileHover={{ x: -5 }}
            >
              <ArrowLeft size={20} />
              Back
            </motion.span>
          </Link>
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto bg-gray-900 rounded-lg overflow-hidden border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="p-8 bg-gradient-to-r from-blue-900/50 to-cyan-900/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2"
              animate={{
                textShadow: "0 0 8px rgba(59, 130, 246, 0.5), 0 0 16px rgba(59, 130, 246, 0.3)"
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {policy[2]}
            </motion.h1>
            <p className="text-blue-300">Policy ID: {`${policy[0]}`}</p>
          </motion.div>
          
          <motion.div 
            className="p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <motion.div 
              className="mb-8 p-6 bg-gray-800 rounded-lg border border-blue-500/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-blue-400 mb-4">Policy Description</h2>
              <p className="text-gray-300">{policy[3]}</p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div>
                <DetailItem 
                  icon={<DollarSign className="text-green-400 h-6 w-6" />}
                  label="Coverage Amount"
                  value={`${Number(BigInt(policy[4]))/10**18} XFI`}
                />
                <DetailItem 
                  icon={<DollarSign className="text-yellow-400 h-6 w-6" />}
                  label="Premium"
                  value={`${(Number(BigInt(policy[5]))/10**18).toFixed(4)} XFI`}
                />
                <DetailItem 
                  icon={<Calendar className="text-blue-400 h-6 w-6" />}
                  label="Policy expiration date"
                  value={` ${new Date(Number(BigInt(policy[6]))*1000).toLocaleDateString()}`}
                />
                <DetailItem 
                  icon={<User className="text-purple-400 h-6 w-6" />}
                  label="Policy Creator"
                  value={`${policy[1].substring(0,15)+"......"}`}
                />
              </div>
              <div>
                <DetailItem 
                  icon={<Shield className="text-green-400 h-6 w-6" />}
                  label="Status"
                  value={policy[7]?"Active":"Not Active"}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}