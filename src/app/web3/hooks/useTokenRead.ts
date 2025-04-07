
import React, { useEffect } from 'react'
import { safeTokenAddress } from '../Addresses'
import { safeTokenAbi } from '../Abi'
import { getContract } from "thirdweb";
import { defineChain } from "thirdweb";
import { useReadContract  } from "thirdweb/react";
import { client } from '../../client';
 import { polygon, polygonAmoy } from 'thirdweb/chains';
const crossFiTestnet = defineChain(4157);

const contract = getContract({
  client:client,
  address:safeTokenAddress,
  chain:polygonAmoy
})


// export const useTokenRead = ({method,args}:{method:string,args?:any})=>{
//   const {data,isLoading} = useReadContract({
//     contract,
//     method,
//     params:args
//   })

//   useEffect(()=>{
//     console.log("Reload Occured");
//   },[data,isLoading])

//   return({data,isLoading})
// }