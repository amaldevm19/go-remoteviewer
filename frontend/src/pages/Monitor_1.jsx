// Monitor.js
import { useState } from 'react';
import { Modal, Button, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import PageHeading from '../components/PageHeading';
import PingOptions from './PingOptions';
import SNMPOptions from './SNMPOptions';
import DeviceList from './DeviceList';

function Monitor() {
  const { register, handleSubmit, reset } = useForm();
  const [devices, setDevices] = useState([]);
  const [open, setOpen] = useState(false);

  const onSubmit = (data) => {
    setDevices([...devices, data]);
    reset(); // Clear form
    handleClose(); // Close the modal
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePing = () => {
    console.log("Ping test for IP address...");
  };

  const handleSNMP = () => {
    console.log("SNMP test for IP address...");
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    height: 500,
    bgcolor: "background.paper",
    border: "2px solid #4CAF50",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
    overflowY: "auto",
  };

  return (
    <div className="p-4">
      <PageHeading title="Monitor IP Devices" />
      <Button variant="contained" color="primary" onClick={handleOpen}>Add New Device</Button>
      <DeviceList devices={devices} 
        handleStartMonitoring={(id) => console.log(`Start monitoring device ${id}`)} 
        handleStopMonitoring={(id) => console.log(`Stop monitoring device ${id}`)} 
        handleView={(id) => console.log(`View device ${id}`)} 
        handleEdit={(id) => console.log(`Edit device ${id}`)} 
        handleDelete={(id) => console.log(`Delete device ${id}`)} 
      />
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <PingOptions register={register} handlePing={handlePing} />
            <SNMPOptions register={register} handleSNMP={handleSNMP} />
            <Button type="submit" variant="contained" color="primary">Add Device</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default Monitor;
