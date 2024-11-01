// SNMPOptions.js
import { TextField, Button, FormControlLabel, Checkbox, FormControl, FormLabel, RadioGroup, Radio, Select, MenuItem } from "@mui/material";

const SNMPOptions = ({ register, handleSNMP }) => {
  return (
    <div className="space-y-2">
      <FormControlLabel
        control={<Checkbox {...register("snmp")} sx={{ color: "green" }} />}
        label="Enable SNMP"
      />
      <TextField
        label="Poll Interval (ms)"
        type="number"
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
      <Button variant="contained" color="secondary" onClick={handleSNMP}>
        Test SNMP
      </Button>
      <FormControl component="fieldset">
        <FormLabel component="legend">Save SNMP Response</FormLabel>
        <RadioGroup
          aria-label="saveSNMPResponse"
          name="saveSNMPResponse"
          {...register("saveSNMPResponse")}
        >
          <FormControlLabel value="db" control={<Radio sx={{ color: "green" }} />} label="Save Response to Database" />
          <FormControlLabel value="file" control={<Radio sx={{ color: "green" }} />} label="Save Response to File" />
          <FormControlLabel value="none" control={<Radio sx={{ color: "green" }} />} label="Do Not Save" />
        </RadioGroup>
      </FormControl>
      <FormControlLabel control={<Checkbox {...register("snmpSilent")} sx={{ color: "green" }} />} label="Silent Mode (No Console Output)" />
      <FormControlLabel control={<Checkbox {...register("snmpAlert")} sx={{ color: "green" }} />} label="Alert on Missing SNMP Response" />
    </div>
  );
};

export default SNMPOptions;
