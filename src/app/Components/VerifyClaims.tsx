"use client"
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { ExternalLink, CheckCircle, Info } from 'lucide-react';
import { useManagerRead } from '../web3/hooks/useManagerRead';
import { useManagerWrite } from '../web3/hooks/useManagerWrite';
import VerifyClaimCard from './VerifyClaimCard';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-blue-700">
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Verify Claims</h1>
          <p className="text-blue-200 mb-8">Review and verify insurance claims</p>
          
          {verifiedClaimId && (
            <div className="mb-8 bg-green-500 bg-opacity-20 backdrop-blur-md border border-green-500 text-green-100 px-6 py-4 rounded-lg" role="alert">
              <strong className="font-bold">Claim Verified Successfully!</strong>
              <p className="inline"> Claim {verifiedClaimId} has been verified and processed.</p>
            </div>
          )}
              <div className='flex flex-col gap-10'>
            {claimIds.map((claimIdFetched,index)=>{
              return(
              <VerifyClaimCard key={index} claimId={claimIdFetched}/>
              )
            })}
            </div>
         
          {claims?claims.length === 0 && (
            <p className="text-center text-blue-300 mt-4">No pending claims to verify.</p>
          ):<></>}
        </div>
      </main>
    </div>
  );
}