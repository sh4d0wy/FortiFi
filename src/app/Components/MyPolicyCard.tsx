"use client"
import { parseEther } from "viem";
import { useManagerWrite } from "../web3/hooks/useManagerWrite";
import toast, { ToastBar } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAccount, useWatchContractEvent } from "wagmi";
import { managerPolygonAddress } from "../web3/Addresses";
import { PolicyMaangerAbi } from "../web3/Abi";
import { useManagerRead } from "../web3/hooks/useManagerRead";
import { policyType } from "./PolicyCard";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MyPolicyCard({policyId}:{policyId:number}) {
  const {address} = useAccount();
  const {write,isSuccess} = useManagerWrite();
  const [policy,setPolicy] = useState<null|any[]>(null);
  const [flag,setFlag] = useState(false);
  
  const {data:policyFetched } = useManagerRead({
    functionName:"policies",
    args:[policyId]
  }) as {data:any}

  const {data:addressToPolicy} = useManagerRead({
    functionName:"addressToPolicy",
    args:[address,policyId]
  })

  const {write:payPremium } = useManagerWrite()

  const handlePremiumPay = ({policyId,premium}:{policyId:number,premium:string})=>{
    payPremium({
      functionName:"payPremium",
      args:[policyId],
      value:BigInt(premium)
    })
  }
  // const {data } = useManagerRead({
  //   functionName:"getAllPoliciesForUser",
  //   args:[address]
  // })

  useEffect(()=>{
   if(policyFetched && addressToPolicy===policyFetched[0]){
    setPolicy(policyFetched)
   }
    },[flag,policyFetched,addressToPolicy])

  useWatchContractEvent({
    address:managerPolygonAddress,
    abi:PolicyMaangerAbi,
    eventName:"PolicyPurchased",
    onLogs:(logs)=>{
      toast.success("Policy Purchased successfully",{
        duration:4000
      })
    }
  })
  
  useWatchContractEvent({
    address:managerPolygonAddress,
    abi:PolicyMaangerAbi,
    eventName:"PremiumPaid",
    onLogs:(logs)=>{
      toast.success("Premium Paid",{
        duration:4000
      })
    }
  })
    if(policy)
    return (
      <motion.div 
        className="bg-gray-900 rounded-lg p-6 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)"
        }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          {policy[2]}
        </h2>
        <div className="space-y-2 mb-6">
          <p className="flex justify-between">
            <span className="text-blue-400">PolicyID:</span> 
            <span className="text-blue-300">{Number(BigInt(policy[0]))}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-blue-400">Coverage:</span> 
            <span className="text-blue-300">{Number(BigInt(policy[4]))/10**18} XFI</span>
          </p>
          <p className="flex justify-between">
            <span className="text-blue-400">Premium:</span> 
            <span className="text-blue-300">{(Number(BigInt(policy[5]))/10**18).toFixed(5)} XFI</span>
          </p>
          <p className="flex justify-between">
            <span className="text-blue-400">Creator:</span> 
            <span className="text-blue-300">{policy[1].slice(0,10)}...</span>
          </p>
          <p className="flex justify-between">
            <span className="text-blue-400">Type:</span> 
            <span className="text-blue-300">{policy[8]}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-blue-400">Expiration Date:</span> 
            <span className="text-blue-300">{new Date(Number(BigInt(policy[6]))*1000).toLocaleDateString()}</span>
          </p>
        </div>

        <div className="flex justify-center gap-20">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href={`/viewdetail/${policy[0]}`}>
              <button className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-lg text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-blue-500/50">
                View Details
              </button>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button 
              className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-lg text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg shadow-green-500/50"
              onClick={()=>handlePremiumPay({policyId:policy[0],premium:String(policy[5])})}
            >
              Pay Premium
            </button>
          </motion.div>
        </div>
      </motion.div>
    )
  }