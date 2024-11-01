import React from 'react'
import { SiGooglecloudstorage } from "react-icons/si";
import { FaComputer } from "react-icons/fa6";

export default function ConnectDeviceIcon({deviceType,color}) {
  return (
    <div className={`relative rounded-full h-24 w-24 cursor-pointer ${color}`} >
      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        {
          deviceType=="NVR"? <SiGooglecloudstorage size={25}/>:<FaComputer size={25}/>
        }
        <div>{deviceType}</div>
      </div>
    </div>
  )
}
