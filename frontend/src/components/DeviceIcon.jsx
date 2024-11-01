import React from 'react'

export default function DeviceIcon({name,children,color,setSelection}) {
  return (
    <div className={`relative rounded-full h-24 w-24 m-10 cursor-pointer ${color}`} onClick={()=>{setSelection(name)}} >
      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        {children}
        <div>{name}</div>
      </div>
    </div>
  )
}
