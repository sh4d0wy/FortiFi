import React, { useEffect } from 'react'
import { useManagerRead } from '../web3/hooks/useManagerRead';
import { CheckCircle, CheckCircle2, ExternalLink, Info } from 'lucide-react';
import { useManagerWrite } from '../web3/hooks/useManagerWrite';

const VerifyClaimCard = ({claimId}:{claimId:number}) => {
    const{data:claim} = useManagerRead({
        functionName:'claims',
        args:[claimId]
    })  as {data:any[]}
    // console.log(claim);

    const {write} = useManagerWrite();

    const handleVerify = (claimId:string) => {
        console.log('Verifying claim:', claimId);
        write({
          functionName:"verifyClaim",
          args:[BigInt(claimId)]
        })
      };
      useEffect(()=>{
        if(claim===undefined){
            console.log('Claim not found');
        }
      },[claim])

      if(claim!=undefined && !claim[2])
    return (
    // <></>
    <>
         <div className="space-y-6">
           
              <div key={claim[0]} className="bg-black bg-opacity-30 backdrop-blur-md rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:bg-opacity-20">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-white">Claim ID: {String(claim[0])}</h2>
                    <span className="text-blue-300">{claim[4]}</span>
                  </div>
                  <div className="mb-4 flex items-start">
                    <Info className="mr-2 h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
                    <p className="text-gray-300">{claim[6]}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => window.open(claim[5], '_blank')}
                      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      >
                      <ExternalLink className="mr-2 h-5 w-5" />
                      View Documents
                    </button>
                    {claim[2] ?
                    <>
                    <button
                      className="flex items-center bg-green-700 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Verified
                    </button>
                    </>:
                    <button
                    onClick={() => handleVerify(String(claim[0]))}
                    className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Verify Claim
                    </button> }
                  </div>
                </div>
              </div>

          </div>
    </>
  )
}

export default VerifyClaimCard