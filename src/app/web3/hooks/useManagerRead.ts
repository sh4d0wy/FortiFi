"use client"
import React, { useEffect } from 'react'
import { managerPolygonAddress, PolicyManagerAddress, safeTokenAddress } from '../Addresses'
import { PolicyMaangerAbi, safeTokenAbi } from '../Abi'
import { getContract } from "thirdweb";
import { defineChain } from "thirdweb";
// import { useReadContract  } from "thirdweb/react";
import {useReadContract} from "wagmi";
import { client } from '../../client';
 import { polygon, polygonAmoy } from 'thirdweb/chains';
const crossFiTestnet = defineChain(4157);

const contract = getContract({
  client:client,
  address:PolicyManagerAddress,
  chain:polygonAmoy
})


// export const useManagerRead = ({method,args}:{method:string,args?:any})=>{
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

export const useManagerRead=({functionName,args}:{functionName?:string,args?:any})=>{
    const req = useReadContract({
        address:PolicyManagerAddress,
        abi:PolicyMaangerAbi,
        functionName,
        args
    })
    return(req);
}