"use client"
import React, { useState } from 'react'
import PolicyCard, { policyType } from './PolicyCard'
import { useManagerRead } from '../web3/hooks/useManagerRead'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const GetPolicies = () => {
  // const [policies,setPolicies] = useState([]);
 
    const {data:policyLength} = useManagerRead({
      functionName:'nextPolicyId',
    }) as {data:BigInt}
    const policyIds = Number(policyLength) ? Array.from({ length: Number(policyLength) }, (_, i) => i) : [];

    return (
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {policyIds.length > 0 ? (
        policyIds.map((policyId, index) => (
          <motion.div
            key={policyId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.1
            }}
          >
            <PolicyCard policyId={policyId} />
          </motion.div>
        ))
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="col-span-full text-center py-12"
        >
          <div className="text-2xl text-blue-400 font-semibold">No policies found</div>
          <p className="text-blue-300 mt-2">Create your first policy to get started</p>
        </motion.div>
      )}
    </div>
  )
}

export default GetPolicies