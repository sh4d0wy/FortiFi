"use client"
// pages/create-policy.js
import { useState } from 'react'
import Head from 'next/head'
import { Shield, DollarSign, Calendar, Umbrella,NotebookPen } from 'lucide-react'
import { useManagerWrite } from '../web3/hooks/useManagerWrite'
import { parseEther } from 'viem'
import { useWatchContractEvent } from 'wagmi'
import { managerPolygonAddress } from '../web3/Addresses'
import { PolicyMaangerAbi } from '../web3/Abi'
import toast from 'react-hot-toast'

export default function CreatePolicy() {
  const [formData, setFormData] = useState({
    _title: '',
    coverageAmount: '',
    expirationDate: '',
    coverageType: '',
    _description:''
  })
  const {write} = useManagerWrite();

  const handleChange = (e:any) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e:any) => {
    e.preventDefault()
    console.log('Creating policy with data:', formData)
    const timestamp = Math.floor((new Date(formData.expirationDate)).getTime()/1000);
    write({
      functionName:'createPolicy',
      args:[formData._title,parseEther(formData.coverageAmount), formData._description,timestamp, formData.coverageType]
    })
  }

  useWatchContractEvent({
    address:managerPolygonAddress,
    abi:PolicyMaangerAbi,
    eventName:"PolicyCreated",
    onLogs(){
      toast.success('Policy Created')
    },
  })
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-blue-700">
      <Head>
        <title>Create Policy - Insurance Protocol</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto bg-black bg-opacity-70 rounded-lg overflow-hidden shadow-2xl">
          <div className="p-8 bg-blue-900 bg-opacity-50">
            <h1 className="text-4xl font-bold text-white mb-2">Create New Policy</h1>
            <p className="text-blue-200">Customize 9 insurance coverage</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <FormField
              label="Policy Title"
              id="title"
              name="_title"
              value={formData._title}
              onChange={handleChange}
              icon={<Shield className="text-blue-400" size={20} />}
            />

            <FormField
              label="Coverage Amount ($)"
              id="coverageAmount"
              name="coverageAmount"
              type="number"
              value={formData.coverageAmount}
              onChange={handleChange}
              icon={<DollarSign className="text-blue-400" size={20} />}
            />

            <FormField
              label="Expiration Date"
              id="expirationDate"
              name="expirationDate"
              type="date"
              value={formData.expirationDate}
              onChange={handleChange}
              icon={<Calendar className="text-blue-400" size={20} />}
            />
            <FormField
              label="Description"
              id="description"
              name="_description"
              type="text"
              value={formData._description}
              onChange={handleChange}
              icon={<NotebookPen className="text-blue-400" size={20} />}
            />
            <div className="relative">
              <label htmlFor="coverageType" className="block text-blue-300 mb-2 font-semibold">
                Coverage Type
              </label>
              <div className="relative">
                <select
                  id="coverageType"
                  name="coverageType"
                  value={formData.coverageType}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 text-white rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select coverage type</option>
                  <option value="defi_risk">DeFi Risks</option>
                  <option value="exchange_hacks">Exchange Hacks</option>
                  <option value="nft_theft">NFT Theft Protection</option>
                  <option value="smartContract_failure">Smart Contract Vulnerability</option>
                  <option value="cyberSecurity">Cyber Security</option>
                </select>
                <Umbrella className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full mt-8 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Create Policy
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

function FormField({ label, id, name, type = "text", value, onChange, icon }:any) {
  return (
    <div>
      <label htmlFor={id} className="block text-blue-300 mb-2 font-semibold">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full p-3 bg-gray-800 text-white rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {icon}
        </div>
      </div>
    </div>
  )
}