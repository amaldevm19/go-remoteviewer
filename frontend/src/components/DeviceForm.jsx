import React, {useEffect} from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography"; 
import {AddDevice} from "../../wailsjs/go/main/Device"

const DeviceForm = ({deviceType}) => {
  const { control, handleSubmit,reset,watch,setValue, formState: { errors,isValid }  } = useForm({mode: "onChange"});
  const deviceIPEnabled = watch("deviceIPEnabled", false);
  const deviceURLEnabled = watch("deviceURLEnabled", false);

  const onSubmit = async (data) => {
    const {deviceType,deviceName,deviceIP,deviceIPPort,deviceURL,deviceURLPort} = data
    await AddDevice(deviceType,deviceName,deviceIP,deviceIPPort,deviceURL,deviceURLPort)
    reset({
        deviceName: "",
        deviceIP: "",
        deviceIPPort: "",
        deviceIPEnabled: false,
        deviceURL: "",
        deviceURLPort: "",
        deviceURLEnabled: false,
      });
  };

  useEffect(() => {
    if (!deviceIPEnabled) {
      setValue("deviceIP", "");
      setValue("deviceIPPort", "");
    }
    if (!deviceURLEnabled) {
      setValue("deviceURL", "");
      setValue("deviceURLPort", "");
    }
  }, [deviceIPEnabled, deviceURLEnabled, setValue]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-gray-800 p-8 rounded-lg shadow-md"
      >
        {/* Form Heading */}
        <Typography variant="h4" component="h2" className="text-white text-center mb-6">
          {deviceType} Configurator
        </Typography>
        {/* Name */}
        <div className="flex items-center">
          <label className="text-white w-32" htmlFor="deviceName">
            Name
          </label>
          <Controller
            name="deviceName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                id="deviceName"
                variant="outlined"
                className="bg-white"
                fullWidth
                error={!!errors.deviceName}
                helperText={errors.deviceName ? "Name is required" : ""}
              />
            )}
            rules={{ required: "Name is required" }}
          />
        </div>

        {/* IP Enabled */}
        <div className="flex items-center">
          <label className="text-white w-32" htmlFor="deviceIPEnabled">
            IP Enabled
          </label>
          <Controller
            name="deviceIPEnabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    id="deviceIPEnabled"
                    className="text-white"
                    checked={deviceIPEnabled}
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: "white",
                      },
                    }}
                  />
                }
                label=""
              />
            )}
          />
        </div>

        {/* IP Address */}
        <div className="flex items-center">
          <label className="text-white w-32" htmlFor="deviceIP">
            IP Address
          </label>
          <Controller
            name="deviceIP"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                id="deviceIP"
                variant="outlined"
                className={`bg-white ${!deviceIPEnabled && "opacity-50"}`}
                disabled={!deviceIPEnabled}
                fullWidth
                error={!!errors.deviceIP}
                helperText={errors.deviceIP ? "IP Address is required" : ""}
              />
            )}
            rules={{ required: deviceIPEnabled && "IP Address is required" }}
          />
        </div>

        {/* IP Port */}
        <div className="flex items-center">
          <label className="text-white w-32" htmlFor="deviceIPPort">
            IP Port
          </label>
          <Controller
            name="deviceIPPort"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                id="deviceIPPort"
                variant="outlined"
                className={`bg-white ${!deviceIPEnabled && "opacity-50"}`}
                disabled={!deviceIPEnabled}
                fullWidth
                error={!!errors.deviceIPPort}
                helperText={errors.deviceIPPort ? "IP Port is required" : ""}
              />
            )}
            rules={{ required: deviceIPEnabled && "IP Port is required" }}
          />
        </div>

        {/* URL Enabled */}
        <div className="flex items-center">
          <label className="text-white w-32" htmlFor="deviceURLEnabled">
            URL Enabled
          </label>
          <Controller
            name="deviceURLEnabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    id="deviceURLEnabled"
                    className="text-white"
                    checked={deviceURLEnabled}
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: "white",
                      },
                    }}
                  />
                }
                label=""
              />
            )}
          />
        </div>

        {/* URL */}
        <div className="flex items-center">
          <label className="text-white w-32" htmlFor="deviceURL">
            URL
          </label>
          <Controller
            name="deviceURL"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                id="deviceURL"
                variant="outlined"
                className={`bg-white ${!deviceURLEnabled && "opacity-50"}`}
                disabled={!deviceURLEnabled}
                fullWidth
                error={!!errors.deviceURL}
                helperText={errors.deviceURL ? "URL is required" : ""}
              />
            )}
            rules={{ required: deviceURLEnabled && "URL is required" }}
          />
        </div>

        {/* URL Port */}
        <div className="flex items-center">
          <label className="text-white w-32" htmlFor="deviceURLPort">
            URL Port
          </label>
          <Controller
            name="deviceURLPort"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                id="urlPort"
                variant="outlined"
                className={`bg-white ${!deviceURLEnabled && "opacity-50"}`}
                disabled={!deviceURLEnabled}
                fullWidth
                error={!!errors.deviceURLPort}
                helperText={errors.deviceURLPort ? "URL Port is required" : ""}
              />
            )}
            rules={{ required: deviceURLEnabled && "URL Port is required" }}
          />
        </div>



        {/* Submit Button */}
        <div className="flex justify-center">
          <Button variant="contained" color="primary" type="submit" disabled={!isValid || (!deviceIPEnabled && !deviceURLEnabled)}>
            {deviceType && "Add "+deviceType}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DeviceForm;
