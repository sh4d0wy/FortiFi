// pages/my-policies.js
import { useState } from 'react'
import Head from 'next/head'
import Navbar from '../Components/Navbar'
import { policyType } from '../Components/PolicyCard'
import { MyPolicies } from '../Components/Mypolicies'

const page= ()=> {
  // Mock data for user's policies (replace with actual data fetching logic)
  return (
    <>
      <MyPolicies/>
    </>
  )
}
export default page;
