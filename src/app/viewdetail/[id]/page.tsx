import React from 'react'
import ViewDetail from '../../Components/ViewDetail'

const page = ({params}:{params:{id:number}}) => {
  const {id} = params;
  return (
    <div>
        <ViewDetail policyId={id}/>
    </div>
  )
}

export default page