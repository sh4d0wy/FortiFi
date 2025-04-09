"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useManagerRead } from '../web3/hooks/useManagerRead';
import { useManagerWrite } from '../web3/hooks/useManagerWrite';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';

export default function VerifyClaimCard({ claimId }: { claimId: number }) {
  const { data: claim } = useManagerRead({
    functionName: "claims",
    args: [claimId]
  }) as any;
  console.log(claim);

  const { write: verifyClaim } = useManagerWrite();

  const { write: rejectClaim } = useManagerWrite();

  const [isVerifying, setIsVerifying] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      await verifyClaim({
        functionName: "verifyClaim",
        args: [claimId]
      });
    } catch (error) {
      console.error("Error verifying claim:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsRejecting(true);
      await rejectClaim({
        functionName: "rejectClaim",
        args: [claimId]
      });
    } catch (error) {
      console.error("Error rejecting claim:", error);
    } finally {
      setIsRejecting(false);
    }
  };

  if (!claim) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gray-900/50 backdrop-blur-md border border-blue-500/20 rounded-xl p-6 shadow-lg shadow-blue-500/10"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white">Claim #{claimId}</h3>
            <p className="text-blue-300">Policy ID: {claim[0]}</p>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVerify}
              disabled={isVerifying || isRejecting}
              className={`px-4 py-2 bg-green-500/20 text-green-300 rounded-lg border border-green-500/50 hover:bg-green-500/30 transition-colors  disabled:opacity-50 disabled:cursor-not-allowed ${claim[3] ? 'bg-green-900/10 text-green-600/30' : ''}`}
            >
              {isVerifying ? 'Verifying...' : 'Verify Claim'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReject}
              disabled={isVerifying || isRejecting}
              className={`px-4 py-2 bg-red-500/20  rounded-lg border border-red-500/50 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${claim[2] ? 'bg-red-900/10 text-red-600/30' : 'text-red-300'}`}
            >
              {isRejecting ? 'Rejecting...' : 'Reject Claim'}
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-gray-400">Buyer Address:</p>
            <p className="text-blue-300 break-all">{claim[4]}</p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-400">Document IPFS Hash:</p>
            <a
              href={`${claim[5]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-blue-400 flex items-center space-x-1"
            >
              <span>View Document</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-gray-400">Description:</p>
          <p className="text-white">{claim[6]}</p>
        </div>

        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className={`w-5 h-5 ${claim[2] ? 'text-green-500' : 'text-gray-500'}`} />
            <span className={`${claim[2] ? 'text-green-300' : 'text-gray-400'}`}>
              {claim[2] ? 'Verified' : 'Not Verified'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <XCircle className={`w-5 h-5 ${claim[3] ? 'text-green-500' : 'text-gray-500'}`} />
            <span className={`${claim[3] ? 'text-green-300' : 'text-gray-400'}`}>
              {claim[3] ? 'Paid' : 'Not Paid'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}