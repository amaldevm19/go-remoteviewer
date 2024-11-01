import {useState,useEffect} from 'react';
import {Route, Routes,useNavigate} from 'react-router-dom';
import { SiGooglecloudstorage } from "react-icons/si";
import { FaComputer } from "react-icons/fa6";
import DeviceIcon from "../components/DeviceIcon"
import PageHeading from '../components/PageHeading';
import NVR from '../components/NVR';
import BMS from '../components/BMS';




function Configuration() {
    const [selection, setSelection] = useState("");

    return (
      <>
      <PageHeading>Device Configuration</PageHeading>
      <div className='flex flex-row justify-center space-x-5 > * + * ' >
        <DeviceIcon name="NVR" color="bg-cyan-600" setSelection={setSelection} >
          <SiGooglecloudstorage size={25}/>
        </DeviceIcon>
        <DeviceIcon name="BMS" color="bg-lime-600" setSelection={setSelection} >
          <FaComputer  size={25}/>
        </DeviceIcon>
      </div>
      <hr/>
      <ConfigurationRoutes selection={selection} />
      </>
    )
}

function ConfigurationRoutes({selection}) {
  switch (selection) {
    case "NVR":
      return (
       <NVR/>
      )
    case "BMS":
      return (
        <BMS/>
      )
    default:
      break;
  } 
}

export default Configuration
