import {useState,useEffect} from 'react';
import PageHeading from '../components/PageHeading';
import DeviceCard from '../components/DeviceCard';
import {GetDevices} from "../../wailsjs/go/main/Device"



function Connect() {
    const [data, setData] = useState([]);
    const fetchData = async () => {
        let result = await GetDevices();
        if(result){
            setData(result);
        }
    };
    useEffect(()=>{
      fetchData();
    },[data])

    return (
      <>
        <PageHeading>Connect Device</PageHeading>
        <div className='flex flex-wrap justify-center space-x-5 ' >
       {
         data?.map((item,index)=>
           <DeviceCard 
            key={index}
              id ={item.id}
             deviceType={item.deviceType}
             deviceName={item.deviceName}
             deviceIP={item.deviceIP}
             deviceIPPort={item.deviceIPPort}
             deviceURL={item.deviceURL}
             deviceURLPort={item.deviceURLPort}
             />
         )
       }
     </div>
   </>
    )
}

export default Connect
