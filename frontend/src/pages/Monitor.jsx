import {useState,useEffect} from 'react';
import { Modal,Radio, RadioGroup,TextField, Button, Checkbox, FormControlLabel, FormControl, FormLabel, Select, MenuItem, Box  } from "@mui/material";
import PageHeading from '../components/PageHeading';
import { useNavigate} from 'react-router-dom';


import {AddMonitor,GetMonitors,DeleteMonitor,StartSingleMonitoring, StopSingleMonitoring, GetSingleMonitorForEdit, UpdateMonitor, OpenCSVFile } from "../../wailsjs/go/main/Monitor"

import { useForm , Controller} from "react-hook-form";
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Visibility as EyeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Storage as StorageIcon,
  Block as BlockIcon,
  InsertDriveFile as InsertDriveFileIcon 
} from "@mui/icons-material";


function Monitor() {
  const { register, handleSubmit, reset, control ,setValue } = useForm();
  const [devices, setDevices] = useState([]);
  const fetchData = async () => {
    let result = await GetMonitors();
    if(result){
      setDevices(result);
    }
  };
  useEffect(()=>{
    fetchData();
  },[devices])

  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // State to determine edit mode
  const [dataForEdit, setDataForEdit] = useState({})
  const handleOpenForEdit = async(id) =>{ 
    setOpen(true);
    let data = await GetSingleMonitorForEdit(id);
    setDataForEdit(data)
    setIsEditMode(true);
  }

  useEffect(() => {
    // Reset the form values when the modal opens or when dataForEdit changes
    if (dataForEdit) {
      setValue("name", dataForEdit.name)
      setValue("ip", dataForEdit.ip)
      setValue("ping", dataForEdit.ping)
      setValue("pingInterval", dataForEdit.pingInterval)
      setValue("pingRetryAttempts", dataForEdit.pingRetryAttempts)
      setValue("pingTimeout", dataForEdit.pingTimeout)
      setValue("savePingResponse", dataForEdit.savePingResponse)
      setValue("pingSilent", dataForEdit.pingSilent)
      setValue("pingAlert", dataForEdit.pingAlert)
      setValue("snmp", dataForEdit.snmp)
      setValue("pollInterval", dataForEdit.pollInterval)
      setValue("oid", dataForEdit.oid)
      setValue("snmpPort", dataForEdit.snmpPort)
      setValue("snmpCommunity", dataForEdit.snmpCommunity)
      setValue("snmpMaxReps", dataForEdit.snmpMaxReps)
      setValue("snmpVersion", dataForEdit.snmpVersion)
      setValue("saveSNMPResponse", dataForEdit.saveSNMPResponse)
      setValue("snmpSilent", dataForEdit.snmpSilent)
      setValue("snmpAlert", dataForEdit.snmpAlert)
      setValue("isMonitoringEnabled", dataForEdit.isMonitoringEnabled)
      setValue("isMonitoring", dataForEdit.isMonitoring)

      
    }else{
      reset();
    }
  }, [dataForEdit, reset]);


  const onSubmit = async (data) => {
    const {
      name ,
      ip ,
      ping ,
      pingInterval ,
      pingRetryAttempts ,
      pingTimeout ,
      savePingResponse ,
      pingSilent ,
      pingAlert ,
      snmp ,
      pollInterval ,
      oid ,
      snmpPort ,
      snmpCommunity ,
      snmpMaxReps ,
      snmpVersion ,
      saveSNMPResponse ,
      snmpSilent ,
      snmpAlert ,
      isMonitoringEnabled ,
      isMonitoring ,
    } = data
    console.log(data)
    if (isMonitoringEnabled || isMonitoring) {
      if (!ping && !snmp) {
        alert("Please enable either Ping or SNMP before selecting monitoring options.");
        return; // Stop form submission
      }
    }
    if (isEditMode) {
      await UpdateMonitor(
        dataForEdit.id,
        name ,
        ip ,
        ping,
        parseInt(pingInterval) ,
        parseInt(pingRetryAttempts) ,
        parseInt(pingTimeout) ,
        savePingResponse ,
        pingSilent ,
        pingAlert ,
        snmp,
        parseInt(pollInterval) ,
        oid ,
        parseInt(snmpPort) ,
        snmpCommunity ,
        parseInt(snmpMaxReps) ,
        snmpVersion ,
        saveSNMPResponse ,
        snmpSilent ,
        snmpAlert ,
        isMonitoringEnabled ,
        isMonitoring ,
      )
    } else {
      await AddMonitor(
        name ,
        ip ,
        ping,
        parseInt(pingInterval) ,
        parseInt(pingRetryAttempts) ,
        parseInt(pingTimeout) ,
        savePingResponse ,
        pingSilent ,
        pingAlert ,
        snmp,
        parseInt(pollInterval) ,
        oid ,
        parseInt(snmpPort) ,
        snmpCommunity ,
        parseInt(snmpMaxReps) ,
        snmpVersion ,
        saveSNMPResponse ,
        snmpSilent ,
        snmpAlert ,
        isMonitoringEnabled ,
        isMonitoring ,
      )
    }
    
    reset(); // Clear form
    handleClose();
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    reset();
    setDataForEdit({})
    setOpen(false);
    setIsEditMode(false); 

  }
  
  const handlePing = () => {
    // Ping logic for the entered IP address
    console.log("Ping test for IP address...");
  };

  const handleSNMP = () => {
    // Ping logic for the entered IP address
    console.log("SNMP test for IP address...");
  };

  const handleDelete = (id) => {
    console.log(id);
    DeleteMonitor(id)
  };
  const navigate = useNavigate();

  const openConsoleWindow = (deviceId) => {
    navigate(`console/${deviceId}`);
  };

  const handleOpenFile =(deviceName,type)=>{
    OpenCSVFile(deviceName + '_' + type + '.csv');
  }
  
  // Styling for modal content
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600, // Fixed width
    height: 500, // Fixed height for scrolling
    bgcolor: "background.paper",
    border: "2px solid #4CAF50",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
    overflowY: "auto", // Enable vertical scrolling
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center">
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add New Device
        </Button>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
        {/* Form to Add IP Device */}
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl mb-4 text-blue-600 text-center">Add IP Device</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <TextField
                label="Device Name"
                fullWidth
                
                {...register("name", { required: true })}
              />
              <TextField
                label="IP Address"
                fullWidth
                
                {...register("ip", { required: true })}
                className="flex-1 mr-4" // Make the input take most of the space
              />
              <Button
                  variant="contained"
                  color="secondary"
                  onClick={handlePing}
                  className="mr-4" // Add spacing between the button and checkbox
                >
                  Test Ping
                </Button>
            
              {/* Ping Options */}
              <div className="space-y-2">
                <FormControlLabel
                  control={
                    <Checkbox 
                      {...register("ping")}
                      sx={{ color: "green" }} // Change color to make it visible on a dark background
                    />
                  }
                  label="Enable Ping"
                  sx={{ color: "blue" }} // Ensure the label color is white on dark background
                />
                <TextField
                  label="Ping Interval (ms)"
                  type="number"
                  fullWidth
                  defaultValue={10000}
                  {...register("pingInterval")}
                />
                <TextField
                  label="Ping Retry Attempts"
                  type="number"
                  defaultValue={1}
                  fullWidth
                  {...register("pingRetryAttempts")}
                />
                <TextField
                  label="Ping Timeout (ms)"
                  type="number"
                  defaultValue={4000}
                  fullWidth
                  {...register("pingTimeout")}
                />
                <Box
                  sx={{
                    border: "2px solid #4CAF50", // Green border
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "16px",
                    display: "block" // Ensures the radios are above the checkbox
                  }}
                >
                <FormControl component="fieldset">
                  <FormLabel component="legend" id="savePingResponse" style={{ color: "black" }}>Save Ping Response</FormLabel>
                  <Controller
                  rules={{ required: true }}
                  control={control}
                  name="savePingResponse"
                  defaultValue="none"
                  render={({ field }) => (
                  <RadioGroup
                  {...field}
                  >
                    <FormControlLabel
                      value="db"
                      control={<Radio sx={{ color: "green" }} />}
                      label="Save Response to Database"
                      sx={{ color: "blue" }}
                    />
                    <FormControlLabel
                      value="file"
                      control={<Radio sx={{ color: "green" }} />}
                      label="Save Response to File"
                      sx={{ color: "blue" }}
                    />
                    <FormControlLabel
                      value="none"
                      control={<Radio sx={{ color: "green" }} />}
                      label="Do Not Save"
                      sx={{ color: "blue" }}
                    />
                  </RadioGroup>
                   )}/>
                </FormControl>
                </Box>  
                <FormControlLabel
                  control={<Checkbox {...register("pingSilent")} 
                  sx={{ color: "green" }}
                  />}
                  label="Silent Mode (No Console Output)"
                  sx={{ color: "blue" }}
                />
                <FormControlLabel
                  control={<Checkbox {...register("pingAlert")} 
                  sx={{ color: "green" }}
                  />}
                  label="Alert on Missing Ping"
                  sx={{ color: "blue" }}
                />
              </div>
                {/* SNMP Options */}
              <div className="space-y-2">
                <FormControlLabel
                  control={<Checkbox {...register("snmp")} 
                  sx={{ color: "green" }}
                  />}
                  label="Enable SNMP"
                  sx={{ color: "blue" }}
                />
                <TextField
                  label="Poll Interval (ms)"
                  type="number"
                  defaultValue={10000}
                  fullWidth
                  {...register("pollInterval")}
                />
                <TextField
                  label="OID"
                  fullWidth
                  {...register("oid")}
                />
                <TextField
                  label="SNMP Port"
                  type="number"
                  fullWidth
                  defaultValue={161}
                  {...register("snmpPort")}
                />
                <TextField
                  label="SNMP Community String"
                  fullWidth
                  {...register("snmpCommunity")}
                />
                <TextField
                  label="Max Repetitions (GetBulk)"
                  type="number"
                  fullWidth
                  {...register("snmpMaxReps")}
                />
                <Select
                  label="SNMP Version"
                  fullWidth
                  defaultValue="v2c"
                  {...register("snmpVersion")}
                >
                  <MenuItem value="v1">v1</MenuItem>
                  <MenuItem value="v2c">v2c</MenuItem>
                  <MenuItem value="v3">v3</MenuItem>
                </Select>
            
                <Button
                variant="contained"
                color="secondary"
                onClick={() => handleSNMP()} // Add your ping logic here
              >
                Test SNMP
              </Button>
                 
            <Box
              sx={{
                border: "2px solid #4CAF50", // Green border
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
                display: "block" // Ensures the radios are above the checkbox
              }}
            >
              <FormControl component="fieldset">
                <FormLabel component="legend" style={{ color: "black" }}>Save SNMP Response</FormLabel>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="saveSNMPResponse"
                  defaultValue="none"
                  render={({ field }) => (
                  <RadioGroup
                  {...field}
                  >
                  <FormControlLabel
                    value="db"
                    control={<Radio sx={{ color: "green" }} />}
                    label="Save Response to Database"
                    sx={{ color: "blue" }}
                  />
                  <FormControlLabel
                    value="file"
                    control={<Radio sx={{ color: "green" }} />}
                    label="Save Response to File"
                    sx={{ color: "blue" }}
                  />
                  <FormControlLabel
                    value="none"
                    control={<Radio sx={{ color: "green" }} />}
                    label="Do Not Save"
                    sx={{ color: "blue" }}
                  />
                </RadioGroup>
                 )}/>
              </FormControl>
            </Box>
            <FormControlLabel
              control={<Checkbox {...register("snmpSilent")} 
              sx={{ color: "green" }}
              />}
              label="Silent Mode (No Console Output)"
              sx={{ color: "blue" }}
            />
            <FormControlLabel
              control={<Checkbox {...register("snmpAlert")} 
              sx={{ color: "green" }}
              />}
              label="Alert on Missing SNMP Response"
              sx={{ color: "blue" }}
            />

             {/* Start Monitoring Checkbox */}
             <FormControlLabel
                  control={<Checkbox {...register("isMonitoringEnabled")} />}
                  label="Enable monitoring for this device"
                  sx={{ color: "blue" }} 
                />
               <FormControlLabel
                  control={<Checkbox {...register("isMonitoring")} />}
                  label="Start Monitoring when created"
                  sx={{ color: "blue" }} 
                />

          </div>
            <Button type="submit" variant="contained" color="primary">
            {isEditMode ? "Edit Device" : "Add Device"} {/* Conditional button text */}
            </Button>
            </form>
          </div>
        </Box>
      </Modal>
      {/* List of Added Devices */}
      <div className="mt-8">
        <div className="flex justify-center">
        <h2 className="text-2xl mb-4">Added Devices</h2>
        </div>
          {devices.length === 0 ? (
          <p>No devices added yet.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 text-black">
              <thead>
              <tr>
                <th className="px-4 py-2">Device Name</th>
                <th className="px-4 py-2">IP Address</th>
                <th className="px-4 py-2">Ping</th>
                <th className="px-4 py-2">SNMP</th>
                <th className="px-4 py-2">Monitor Status</th>
                <th className="px-4 py-2">View</th>
                <th className="px-4 py-2">Open Ping Response</th>
                <th className="px-4 py-2">Open SNMP Response</th>
                <th className="px-4 py-2">Edit</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{device.name}</td>
                  <td className="px-4 py-2">{device.ip}</td>
                  <td className="px-4 py-2">{device.ping ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">{device.snmp ? "Yes" : "No"}</td>
                    {/* Monitor Status: Show Play or Stop based on status */}
            <td className="px-4 py-2 ">
              {device.isMonitoring ? (
                <StopIcon
                  className="cursor-pointer text-red-600"
                  onClick={async () => StopSingleMonitoring(device.id)}
                />
              ) : (
                <PlayIcon
                  className="cursor-pointer text-green-600"
                  onClick={async () => StartSingleMonitoring(device.id)}
                />
              )}
            </td>
                     {/* View: Eye Icon */}
            <td className="px-4 py-2">
              <EyeIcon
                className="cursor-pointer text-blue-600"
                onClick={() => openConsoleWindow(device.id)}
              />
            </td>
            {/* Open: File or Icon */}
            <td className="px-4 py-2">
              {device.savePingResponse === 'file' && (
                <button
                  onClick={() => handleOpenFile(device.name,"ping")}
                  className="text-green-500 hover:text-green-600"
                  title="Open log file"
                >
                  <InsertDriveFileIcon />
                </button>
                )}
              {device.savePingResponse === 'db' && (
                <button
                  onClick={() => handleOpenDB(device.id)}
                  className="text-green-500 hover:text-green-600"
                  title="Open log file"
                >
                <StorageIcon/> 
                </button>
                )}
              {device.savePingResponse === 'none' && (<BlockIcon/> )}
            </td>
            <td className="px-4 py-2">
            {device.saveSNMPResponse === 'file' && (
                <button
                  onClick={() => handleOpenFile(device.name,"snmp_log")}
                  className="text-green-500 hover:text-green-600"
                  title="Open log file"
                >
                  <InsertDriveFileIcon />
                </button>
                )}
              {device.saveSNMPResponse === 'db' && (
                <button
                  onClick={() => handleOpenDB(device.id)}
                  className="text-green-500 hover:text-green-600"
                  title="Open log file"
                >
                <StorageIcon/> 
                </button>
                )}
              {device.saveSNMPResponse === 'none' && (<BlockIcon/> )}
            </td>
                       {/* Edit: Pen Icon */}
            <td className="px-4 py-2">
              <EditIcon
                className="cursor-pointer text-yellow-600"
                onClick={() => handleOpenForEdit(device.id)}
              />
            </td>

            {/* Delete: Trash Icon */}
            <td className="px-4 py-2">
              <DeleteIcon
                className="cursor-pointer text-red-600"
                onClick={() => handleDelete(device.id)}
              />
            </td>
                </tr>
              ))}
            </tbody>
            </table>
        )}
      </div>
    </div>
  )
}

export default Monitor
