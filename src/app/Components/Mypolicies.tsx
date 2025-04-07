"use client";

import { useEffect, useState } from "react";
import { useManagerRead } from "../web3/hooks/useManagerRead";
import { useAccount, useTransaction } from "wagmi";
import PolicyCard, { policyType } from "./PolicyCard";
import MyPolicyCard from "./MyPolicyCard";
import { motion } from "framer-motion";

export const MyPolicies = () => {
  const {address} = useAccount();

  const handleClaimPolicy = (policyId: number) => {
    console.log("Claiming policy:", policyId);
  };

  const {data:policyLength} = useManagerRead({
    functionName:"nextPolicyId"
  })
  const policyIds = Number(policyLength) ? Array.from({ length: Number(policyLength) }, (_, i) => i) : [];

  return (
    <div className="min-h-screen bg-black">
      <main className="container mx-auto px-4 py-24">
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
            My Policies
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
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
                  <MyPolicyCard policyId={policyId} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="col-span-full text-center py-12"
              >
                <div className="text-2xl text-blue-400 font-semibold">No Policies Found</div>
                <p className="text-blue-300 mt-2">You have not purchased any policies yet</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};
// function PolicyCard({ policy, onPayPremium, onClaimPolicy }: any) {
//   return (
//       <div className="bg-black bg-opacity-50 rounded-lg p-6 text-white">
//         <h2 className="text-2xl font-semibold mb-4">{policy.title}</h2>
//         <div className="space-y-2 mb-6">
//           <p><span className="text-blue-300">Coverage:</span> {Number(BigInt(policy.coverageAmount))/10**18}</p>
//           <p><span className="text-blue-300">Premium:</span> {Number(BigInt(policy.premium))/10**18}</p>
//           <p><span className="text-blue-300">Provider:</span> {policy.owner.slice(0,10)}...</p>
//           <p><span className="text-blue-300">Type:</span> {policy.coverageType}</p>
//           <p><span className="text-blue-300">Duration:</span> {new Date(Number(BigInt(policy.expirationDate))*1000  ).toLocaleString()}</p>
//         </div>
//         <div className="flex flex-col space-y-2">
//         {!policy.premiumPaid && (
//           <button
//             onClick={() => onPayPremium(policy.id)}
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
//           >
//             Pay Premium
//           </button>
//         )}
//         <button
//           onClick={() => onClaimPolicy(policy.id)}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
//         >
//           Claim Policy
//         </button>
//       </div>
//       </div>
//     // <div className="bg-black bg-opacity-50 rounded-lg p-6 text-white">
//     //   <h2 className="text-2xl font-semibold mb-4">{policy.title}</h2>
//     //   <div className="space-y-2 mb-6">
//     //     <p>
//     //       <span className="text-blue-300">Coverage:</span> {Number(BigInt(policy.coverageAmount))/(10**18)}
//     //     </p>
//     //     <p>
//     //       <span className="text-blue-300">Premium:</span> {policy.premium}
//     //     </p>
//     //     <p>
//     //       <span className="text-blue-300">Status:</span> {policy.isActive}
//     //     </p>

//     //   </div>
     
//     // </div>
//   );
// }
