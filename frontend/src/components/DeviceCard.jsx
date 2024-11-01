import React from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ConnectDeviceIcon from "./ConnectDeviceIcon";
import {DeleteDevice} from "../../wailsjs/go/main/Device"


export default function DeviceCard({id,deviceType,deviceName,deviceIP,deviceIPPort,deviceURL,deviceURLPort}) {
  return (
    <>
        <Card sx={{ backgroundColor: '#2D2D2D', margin:5}}>
            <Typography sx={{ color: 'white', fontSize: 14 }}>
            {deviceName}
            </Typography>
        <CardContent className='flex flex-row justify-center'>
            <ConnectDeviceIcon deviceType={deviceType} color="bg-cyan-600" />
        </CardContent>
        <CardActions className='flex flex-col '>
            {
                deviceIP?<div>
                <Typography sx={{ color: 'white', fontSize: 14 }}>
                IP : {deviceIP}:{deviceIPPort} <Button size="small" onClick={()=>{window.open(deviceIP+":"+deviceIPPort,"_blank")}}>Connect</Button>
                </Typography>
                </div>:""
            }
            {
                deviceURL?<div>
                <Typography sx={{ color: 'white', fontSize: 14 }}>
                URL : {deviceURL}:{deviceURLPort} <Button size="small" onClick={()=>{window.open(deviceURL+":"+deviceURLPort,"_blank")}}>Connect</Button>
                </Typography>
                </div>:""
            }
           <Button size="small" onClick={async ()=>{await DeleteDevice(id)}}>Delete</Button>
        </CardActions>
        </Card>
        
    </>
  )
}
