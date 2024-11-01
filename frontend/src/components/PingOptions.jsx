// PingOptions.js
import { TextField, Button, FormControlLabel, Checkbox, FormControl, FormLabel, RadioGroup, Radio } from "@mui/material";
import { useForm } from "react-hook-form";

const PingOptions = ({ register, handlePing }) => {
  return (
    <div className="space-y-2">
      <TextField
        label="Ping Interval (ms)"
        type="number"
        fullWidth
        {...register("pingInterval")}
      />
      <TextField
        label="Ping Retry Attempts"
        type="number"
        fullWidth
        {...register("pingRetryAttempts")}
      />
      <TextField
        label="Ping Timeout (ms)"
        type="number"
        fullWidth
        {...register("pingTimeout")}
      />
      <FormControlLabel
        control={<Checkbox {...register("ping")} sx={{ color: "green" }} />}
        label="Enable Ping"
      />
      <Button variant="contained" color="secondary" onClick={handlePing}>
        Test Ping
      </Button>
      <FormControl component="fieldset">
        <FormLabel component="legend">Save Ping Response</FormLabel>
        <RadioGroup
          aria-label="savePingResponse"
          name="savePingResponse"
          {...register("savePingResponse")}
        >
          <FormControlLabel value="db" control={<Radio sx={{ color: "green" }} />} label="Save Response to Database" />
          <FormControlLabel value="file" control={<Radio sx={{ color: "green" }} />} label="Save Response to File" />
          <FormControlLabel value="none" control={<Radio sx={{ color: "green" }} />} label="Do Not Save" />
        </RadioGroup>
      </FormControl>
      <FormControlLabel control={<Checkbox {...register("pingSilent")} sx={{ color: "green" }} />} label="Silent Mode (No Console Output)" />
      <FormControlLabel control={<Checkbox {...register("pingAlert")} sx={{ color: "green" }} />} label="Alert on Missing Ping" />
    </div>
  );
};

export default PingOptions;
