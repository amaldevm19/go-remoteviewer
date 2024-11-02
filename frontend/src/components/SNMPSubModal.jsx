
import React, {useState,useEffect} from 'react'
import { Modal,Radio, RadioGroup,TextField, Button, Checkbox, FormControlLabel, FormControl, FormLabel, Select, MenuItem, Box  } from "@mui/material";
import { useForm , Controller, useWatch } from "react-hook-form";

function SNMPSubModal({openSnmpSubmodal, setOpenSnmpSubmodal,modalStyle}) {
    const { register, handleSubmit, reset, control ,setValue } = useForm();
    const onSubmit = async (data) => {
        console.log(data);
        handleClose();
    };
    const handleClose = () => {
        reset();
        setOpenSnmpSubmodal(false); 
    }
    return (
        <>
        <Modal open={openSnmpSubmodal} onClose={handleClose}>
            <Box sx={modalStyle}>
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl mb-4 text-blue-600 text-center">Set SNMP V3 Parameters</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Button type="submit" variant="contained" color="primary">OK</Button>
                </form>
            </div>
            </Box>
        </Modal>
        
        </>
    )
}

export default SNMPSubModal


