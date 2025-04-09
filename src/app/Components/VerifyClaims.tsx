"use client"
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { ExternalLink, CheckCircle, Info } from 'lucide-react';
import { useManagerRead } from '../web3/hooks/useManagerRead';
import { useManagerWrite } from '../web3/hooks/useManagerWrite';
import VerifyClaimCard from './VerifyClaimCard';
import { motion } from 'framer-motion';

type claim={
  claimId:number;
  policyId:number;
  isVerified:boolean;
  isPaid:boolean;
  buyerAddress:string;
  documentIPFSHash:string;
  description:string;
}

export default function VerifyClaims() {
  const {data} = useManagerRead({
    functionName:"getAllUnverifiedClaims"
  })
  const {write } = useManagerWrite();
  const addressZero = "0x0000000000000000000000000000000000000000"
  const [claims, setClaims] = useState<null|claim[]>(null);
  const [verifiedClaimId, setVerifiedClaimId] = useState<null|String>(null);

  const {data:claimLength} = useManagerRead({
    functionName:"nextClaimId"
  })

  
  useEffect(()=>{
    if(Array.isArray(data)){
      setClaims(data);
    }
  },[data])
  const claimIds = Number(claimLength) ? Array.from({ length: Number(claimLength) }, (_, i) => i) : [];
  
  // Instead of mapping, we'll render the VerifyClaimCard component for each ID
  return (
    <div className="min-h-screen bg-black">
      <Head>
        <title>FortiFi - Verify Claims</title>
      </Head>
      <main className="container mx-auto px-4 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2"
          >
            Verify Claims
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-blue-300 mb-8"
          >
            Review and verify insurance claims
          </motion.p>
          
          {verifiedClaimId && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 bg-green-500/10 backdrop-blur-md border border-green-500/50 text-green-300 px-6 py-4 rounded-lg shadow-lg shadow-green-500/20"
              role="alert"
            >
              <strong className="font-bold">Claim Verified Successfully!</strong>
              <p className="inline"> Claim {verifiedClaimId} has been verified and processed.</p>
            </motion.div>
          )}

          <div className="flex flex-col gap-6 mt-8">
            {claimIds.map((id, index) => (
              <VerifyClaimCard key={id} claimId={id} />
            ))}
          </div>
          
          {claimIds.length === 0 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-blue-300 mt-4"
            >
              No pending claims to verify.
            </motion.p>
          )}
        </motion.div>
      </main>
    </div>
  );
}