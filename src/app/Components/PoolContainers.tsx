"use client"
import React, { useEffect, useState } from 'react'
import { PoolInfoCard } from './PoolCards';
import { usePoolRead } from '../web3/hooks/usePoolRead';
import { useAccount, useWatchContractEvent, useWriteContract } from 'wagmi';
import { usePoolWrite } from '../web3/hooks/usePoolWrite';
import { poolPolygonAddress } from '../web3/Addresses';
import { InsurancePoolAbi } from '../web3/Abi';
import { parseEther } from 'viem';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const PoolContainers = () => {
    const [totalPoolSize, setTotalPoolSize] = useState<number>(0);
    const [userStaked, setUserStaked] = useState(0)
    const [userRewards, setUserRewards] = useState(250)
    const [depositAmount, setDepositAmount] = useState('')
    const [withdrawAmount, setWithdrawAmount] = useState('')

    const {address,isConnected} = useAccount();
    const {data:totalLiquidity,isLoading:LiquidityLoading} = usePoolRead({
      functionName:"totalLiquidity",
      args:[]
    })

    const {data:providerBalance} = usePoolRead({
      functionName: "getProviderBalance",
      args:[address]
    })
    
    const {data:poolRewards} = usePoolRead({
      functionName:"rewardsOfProviders",
      args:[address]
    })
    const {write,isSuccess} = usePoolWrite();

    console.log(totalLiquidity);

    useEffect(()=>{
      setTotalPoolSize(Number(totalLiquidity)/10**18);
      setUserStaked(Number(providerBalance)/10**18);
      setUserRewards(Number(poolRewards)/10**18)
    },[totalLiquidity,providerBalance,isSuccess,poolRewards])
   

    
  const handleDeposit = () => {
    write({
        functionName: "provideLiquidity",
        args: [],
        value:parseEther(depositAmount)
      });
  };


    useWatchContractEvent({
      address:poolPolygonAddress,
      abi:InsurancePoolAbi,
      eventName: "LiquidityProvided",
      onLogs(logs){
          toast.success("Liquidity provided successfully")
      }
    })
    useWatchContractEvent({
      address:poolPolygonAddress,
      abi:InsurancePoolAbi,
      eventName: "LiquidityWithdrawn",
      onLogs(logs){
          toast.success("Liquidity Withdrawn Successfully",{
            duration:4000
          })
      }
    })
    const handleWithdraw = (e:any) => {
      e.preventDefault()
      // Implement withdraw logic here
      console.log('Withdrawing:', withdrawAmount)
      write({
        functionName: "withdrawLiquidity",
        args: [parseEther(withdrawAmount)],
      });
    }
  
    console.log(depositAmount)
    return (
      <div className="min-h-screen w-full bg-black py-10 px-20">
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
              Insurance Pool
            </motion.h1>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <PoolInfoCard
                  title="Total Insurance Pool"
                  value={`${totalPoolSize.toLocaleString()} XFI`}
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <PoolInfoCard
                  title="Your Staked Amount"
                  value={`${userStaked.toLocaleString()} XFI`}
                />
              </motion.div>
            </motion.div>

            <motion.div 
              className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.div 
                className="bg-gray-900 rounded-lg p-6 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)"
                }}
              >
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
                  Deposit Liquidity
                </h2>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Amount to deposit"
                  className="w-full p-2 mb-4 bg-gray-800 text-white rounded border border-blue-500/20 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    onClick={handleDeposit}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-lg text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-blue-500/50"
                  >
                    Deposit
                  </button>
                </motion.div>
              </motion.div>

              <motion.form
                onSubmit={handleWithdraw}
                className="bg-gray-900 rounded-lg p-6 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)"
                }}
              >
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
                  Withdraw Liquidity
                </h2>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Amount to withdraw"
                  className="w-full p-2 mb-4 bg-gray-800 text-white rounded border border-blue-500/20 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-lg text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-blue-500/50"
                  >
                    Withdraw
                  </button>
                </motion.div>
              </motion.form>
            </motion.div>
          </motion.div>
        </main>
      </div>
    );
}

export default PoolContainers