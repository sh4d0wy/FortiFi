"use client"
import React, { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { InsurancePoolAddress, poolPolygonAddress, safePolygonAddress, safeTokenAddress } from '../web3/Addresses';
import { InsurancePoolAbi, safeTokenAbi } from '../web3/Abi';

const DevNeeds = () => {
    const {writeContract} = useWriteContract();
    const [mintAddress,setMintAddress] = useState<string>('');
    const [mintAmount,setMintAmount] = useState<string>('');

    const mint = ({address,amount}:{address:string,amount:string})=>{
        writeContract({
            address:safeTokenAddress,
            abi:safeTokenAbi,
            functionName: 'mint',
            args:[address,BigInt(amount)*BigInt(10**18)]
        })
    }
    
    const approve = ({address,amount}:{address:string,amount:string})=>{
        writeContract({
            address:safeTokenAddress,
            abi:safeTokenAbi,
            functionName: 'approve',
            args:[address,BigInt(amount)*BigInt(10**18)]
        })
    }
    const setPolicyManager = ({address}:{address:string})=>{
        writeContract({
            address:InsurancePoolAddress,
            abi:InsurancePoolAbi,
            functionName: 'setPolicyManager',
            args:[address]
        })
    }
    
  return (
    <div className='flex flex-col mt-52 gap-10 items-center justify-center'>
            <input type ="text" placeholder="address" className="w-[300px] text-black" value={mintAddress} onChange={(e:any)=>setMintAddress(e.target.value)}/>
            <input type ="text" placeholder="amount" className="w-[300px] text-black" value={mintAmount} onChange={(e:any)=>setMintAmount(e.target.value)}/>
            <button className="w-[50px] bg-red-300 text-black" onClick={()=>mint({address:mintAddress,amount:mintAmount})}>Mint</button>       
            <button className="w-fit p-4 bg-red-300 text-black" onClick={()=>approve({address:mintAddress,amount:mintAmount})}>Approve</button>
            <button className="w-fit p-4 bg-red-300 text-black" onClick={()=>setPolicyManager({address:mintAddress})}>setPolicyManager</button>
            
    </div>
  )
}

export default DevNeeds