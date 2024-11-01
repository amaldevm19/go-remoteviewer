
import { useParams } from 'react-router-dom';
import {useState,useEffect} from 'react';
import {EventsOn, EventsOff } from "../../wailsjs/runtime/runtime.js"


const ConsoleWindow = () => {
  const { deviceId } = useParams();

  // Fetch responses for the device
  const [responses, setResponses] = useState([{}]);

  useEffect( () => {
     // Listen for the "ping-response" event from Wails backend
     EventsOn("response", (data) => {
        console.log(data)
        if (data.deviceId === deviceId) {
          setResponses((prevResponses) => [...prevResponses, data]);
        }
      });
  
      // Cleanup event listener on component unmount
      return () => {
        EventsOff("response");
      };

  }, [deviceId]);

  return (
    <>
    <div className="bg-black text-green-400 p-4">
      <h2>Device Responses - {deviceId}</h2>
      <div className="response-list overflow-auto">
        {responses.map((data, index) => (
          <p key={index}> <span className='text-green'>{data.status}</span> {data.response}</p>
        ))}
      </div>
    </div>
    </>
  );
};

export default ConsoleWindow;
