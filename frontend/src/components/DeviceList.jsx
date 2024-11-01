// DeviceList.js
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { PlayArrow as PlayIcon, Stop as StopIcon, Visibility as EyeIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const DeviceList = ({ devices, handleStartMonitoring, handleStopMonitoring, handleView, handleEdit, handleDelete }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Device Name</TableCell>
            <TableCell>IP Address</TableCell>
            <TableCell>Ping</TableCell>
            <TableCell>SNMP</TableCell>
            <TableCell>Monitor Status</TableCell>
            <TableCell>View</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.map((device, index) => (
            <TableRow key={index}>
              <TableCell>{device.name}</TableCell>
              <TableCell>{device.ip}</TableCell>
              <TableCell>{device.ping ? "Yes" : "No"}</TableCell>
              <TableCell>{device.snmp ? "Yes" : "No"}</TableCell>
              <TableCell>
                {device.isMonitoring ? (
                  <StopIcon className="cursor-pointer text-red-600" onClick={() => handleStopMonitoring(device.id)} />
                ) : (
                  <PlayIcon className="cursor-pointer text-green-600" onClick={() => handleStartMonitoring(device.id)} />
                )}
              </TableCell>
              <TableCell>
                <EyeIcon className="cursor-pointer text-blue-600" onClick={() => handleView(device.id)} />
              </TableCell>
              <TableCell>
                <EditIcon className="cursor-pointer text-yellow-600" onClick={() => handleEdit(device.id)} />
              </TableCell>
              <TableCell>
                <DeleteIcon className="cursor-pointer text-red-600" onClick={() => handleDelete(device.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DeviceList;
