import React,{useState} from 'react'


export default function About() {

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold mb-6">About Remote Device Viewer</h1>
    <p className="text-xl mb-4">
      Remote Device Viewer is designed to streamline the management and access to your NVRs and BMS devices.
    </p>
    <p className="text-xl">
      Use the Configure Devices page to add or edit your device information. The Connect to Devices page provides
      a convenient way to view and manage your devices remotely by simply clicking on the available links.
    </p>
    <p className="text-md mt-12">
        &copy; 2024-2025 Remote Device Viewer. Created by Amaldev Mahadevan. All rights reserved.
    </p>
  </div>
  )
}
