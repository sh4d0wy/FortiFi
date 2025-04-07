"use client";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { FileText, Key, Upload } from "lucide-react";
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PinataSDK } from "pinata-web3";
import { useManagerWrite } from "../web3/hooks/useManagerWrite";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface FormData {
  policyId: string;
  description: string;
  document: File | null;
}

const FormField = ({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  icon,
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <label htmlFor={id} className="block text-blue-400 mb-2 font-semibold">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 bg-gray-800 text-white rounded-md pl-10 border border-blue-500/20 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
        required
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
        {icon}
      </div>
    </div>
  </motion.div>
);

export default function ClaimPolicy() {
  const [formData, setFormData] = useState<FormData>({
    policyId: "",
    description: "",
    document: null,
  });
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {write:claimPolicy,isSuccess} = useManagerWrite();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (ipfsHash:string) => {
    console.log("Submitting claim with data:", formData);
    console.log("IPFShash: ",ipfsHash);
    // Here you would typically send the data to your backend or smart contract
    claimPolicy({
      functionName:"claimPolicy",
      args:[formData.policyId,ipfsHash,formData.description]
    })
    
    setIsSubmitted(true);      

  };

  const handleIPFSUpload = async (e: React.MouseEvent) => {
    console.log("Uploading to IPFS...")
    const pinata = new PinataSDK({
      pinataJwt:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiMTY3MDQ4Yi1kNWJhLTRjNGYtOTY0NS03NWE4ZmQ1NWQ3YmQiLCJlbWFpbCI6InNha3NoYW1iaHVncmE4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI0NWRmMzQ4ZTMzNjk5ZmEzZjM5NSIsInNjb3BlZEtleVNlY3JldCI6IjYzZjk5NWUyYzM3NjE3NmI3Y2JkOWM5NzVhMmFlNzAxYWFiOTBlZTY1MzE5MDkwMjdiNzVkNzZiMDc5MzNjYTMiLCJleHAiOjE3NTg5NTQ0MDF9.rxNO6L5RoS_615dhsNmH5Fxdz-QmiZ0fTapMxsFxd50",
      pinataGateway: "olive-fashionable-mule-815.mypinata.cloud",
    });

    const file = new File(["hello"], "Testing.txt", { type: "text/plain" });
    try {
      const upload = await pinata.upload.file(
        formData.document ? formData.document : file
      );
      if (upload) {
        const ipfsURL =  `https://olive-fashionable-mule-815.mypinata.cloud/ipfs/` + upload.IpfsHash
        setIpfsHash(ipfsURL);
        console.log("Uploaded with URL: " +ipfsURL);
        handleSubmit(ipfsURL);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
    if(isSubmitted){
      toast.success("Claim submitted successfully")
    }
  },[isSubmitted])

  return (
    <div className="min-h-screen bg-black">
      <Head>
        <title>Claim Policy - FortiFi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto px-4 py-24">
        <motion.div 
          className="max-w-2xl mx-auto bg-gray-900 rounded-lg overflow-hidden border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="p-8 bg-gradient-to-r from-blue-900/50 to-cyan-900/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2"
              animate={{
                textShadow: "0 0 8px rgba(59, 130, 246, 0.5), 0 0 16px rgba(59, 130, 246, 0.3)"
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              Claim Policy
            </motion.h1>
            <p className="text-blue-300">Submit your insurance claim</p>
          </motion.div>

          <motion.div 
            className="p-8 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <FormField
              label="Policy ID"
              id="policyId"
              name="policyId"
              value={formData.policyId}
              onChange={handleChange}
              icon={<Key size={20} />}
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <label
                htmlFor="description"
                className="block text-blue-400 mb-2 font-semibold"
              >
                Claim Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 text-white rounded-md border border-blue-500/20 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                rows={4}
                required
              ></textarea>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <label
                htmlFor="documents"
                className="block text-blue-400 mb-2 font-semibold"
              >
                Supporting Documents
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="documents"
                  name="document"
                  onChange={handleChange}
                  className="hidden"
                  required
                />
                <motion.label
                  htmlFor="documents"
                  className="w-full p-3 bg-gray-800 text-white rounded-md pl-10 border border-blue-500/20 hover:border-blue-500/50 focus:outline-none transition-all duration-300 cursor-pointer flex items-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"
                    size={20}
                  />
                  <span className="text-blue-300">
                    {formData.document ? formData.document.name : "Choose a file"}
                  </span>
                </motion.label>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={handleIPFSUpload}
                className="w-full mt-8 bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 rounded-lg text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-semibold text-lg shadow-lg shadow-blue-500/50"
              >
                Claim Policy
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
