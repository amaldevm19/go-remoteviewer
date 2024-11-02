import React, { useState, useEffect } from 'react';
import {EventsOn, EventsOff } from "../../wailsjs/runtime/runtime.js"

const AlertBox = () => {
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(false); // 'success' or 'fail'
    const autoCloseTime = 5000;

    useEffect(() => {
        EventsOn("PingTestResponse", (response) => {
            console.log(response)
          setAlertMessage(response.Message);
          setAlertType(response.Status); // Expecting 'success' or 'fail' from backend
          setAlertVisible(true);
    
          setTimeout(() => setAlertVisible(false), autoCloseTime);
        });

        return () => {
            EventsOff("PingTestResponse");
          };
      }, []);

      const handleClose = () => {
        setAlertVisible(false);
      };

      const alertStyles =
      alertType === true
        ? 'bg-green-600'
        : 'bg-red-600';

        return (
            alertVisible && (
              <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${alertStyles} text-white p-4 rounded-lg shadow-lg z-50 flex items-center space-x-2`} 
              style={{ zIndex: 1500 }} // custom z-index to ensure alert is above modal
              >
                <span>{alertMessage}</span>
                <button
                  onClick={handleClose}
                  className="ml-4 bg-white text-black rounded-full px-2 py-1 font-bold"
                >
                  &times;
                </button>
              </div>
            )
          );

}

export default AlertBox;