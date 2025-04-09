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
