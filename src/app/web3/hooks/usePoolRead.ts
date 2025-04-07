
import React, { useEffect } from 'react'
import { InsurancePoolAddress, poolPolygonAddress, safeTokenAddress } from '../Addresses'
import { InsurancePoolAbi, safeTokenAbi } from '../Abi'
import { getContract } from "thirdweb";
import { defineChain } from "thirdweb";
// import { useReadContract  } from "thirdweb/react";
import { useReadContract } from 'wagmi';
import { client } from '../../client';
 import { polygon, polygonAmoy } from 'thirdweb/chains';
const crossFiTestnet = defineChain(4157);

const contract = getContract({
  client:client,
  address:InsurancePoolAddress,
  chain:polygonAmoy
})


export const usePoolRead=({functionName,args}:{functionName:string,args?:any})=>{
  const req = useReadContract({
      address:InsurancePoolAddress,
      abi:InsurancePoolAbi,
      functionName,
      args
  })
  return(req);
}