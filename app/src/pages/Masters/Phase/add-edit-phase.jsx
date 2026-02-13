import "../../../styles/Drawer.css";
import { AccountTree, Add, Close, Save } from '@mui/icons-material'
import { Button, Checkbox, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React from 'react'
import { RippleEffect } from "../../../utilities/ripple";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../config/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../../../redux/slices/snackbar";

const AddEditPhase = (props) => {

    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch();

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            process: "",
            phaseName: "",
            phaseInfo: "",
        },
        mode: "onBlur",
        reValidateMode: "onChange",
    });

    const [processList, setProcessList] = React.useState([])

    React.useEffect(() => {
        if(props.phase) reset(props.phase)
    }, [props.phase])


    React.useEffect(() => {
        getProcessList();
    }, [])


    const getProcessList = async () => {
        try {
            const result = await axiosInstance.get(`/prcss/fetch`).then(res => res.data)
            if(result.statuscode == 202) {
                setProcessList(result.data)
            }
        }
        catch (error) {
            console.error(error)
        }
    }


    const onSubmit = async (data) => {
        // console.log(user)
        // console.log(data);
        data.createdby = user?._id;
        data.status = "Active";
        
        try {
            let id = props?.phase?._id
            let url = id ? `/phs/update?id=${id}` : `/phs/create`
            const result = await axiosInstance[id ? "put":"post"](url, data).then(res => res.data)
            
            if(result.statuscode === 201){
                props.onClose(); // Close the drawer
                dispatch(showSnackbar({ message: result.message, severity: 'success', }));
            }

        } catch (error) {
            const message = error.response ? error.response.data.message : error.message;
            dispatch(showSnackbar({ message, severity: 'error', }));
        }
    };

    const handleReset = (e) => {
        RippleEffect(e)
        reset();
    };

    return (
        <section className="drawer-container">
            <div className="drawer-header">
                <Typography className="title" color="primary">
                    <AccountTree color="primary" style={{ fontSize: "2rem", margin: "-10px 0" }} /> {props?.phase ? "UPDATE":"ADD"} PHASE
                </Typography>
                <IconButton onClick={() => props.onClose()}> <Close color="error" width={300} /> </IconButton>
            </div>
            <form className="drawer-form" onSubmit={handleSubmit(onSubmit)}>

                <div className="input-container">
                    {!!processList.length && <FormControl variant="filled" fullWidth error={!!errors.process}>
                        <InputLabel id="process-label">Process</InputLabel>
                        <Select labelId="process-label" id="process" defaultValue={props?.phase?.process}
                            {...register("process", { required: "Process is required" })}
                            MenuProps={{ PaperProps: { style: { maxHeight: 200, }, }, }}
                        >
                            <MenuItem value=""> <em>Select</em> </MenuItem>
                                {processList.map((process) => (
                                    <MenuItem key={process._id} value={process._id}>
                                        {process.processName}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>}
                </div>
                <div className="input-container"> 
                    <TextField label="Phase Name" variant="filled" fullWidth 
                        {...register("phaseName", { required: "Phase Name is required" })}
                        error={!!errors.phaseName} helperText={errors.phaseName?.message}
                    /> 
                </div>
                <div className="input-container"> 
                    <TextField  label="Phase Info"  variant="filled"  fullWidth  type="text" {...register("phaseInfo")}
                        error={!!errors.phaseInfo} helperText={errors.phaseInfo?.message} /> 
                </div>
                

                <div className="action-buttons">
                    <div style={{padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "1rem"}}>
                        <Button type="submit" variant="contained" size="large">
                            {props?.phase ? "UPDATE":<> ADD <Add style={{ margin: "-3px 0 0 4px" }} /></>} 
                        </Button>
                        
                        <div className="reset-button" onClick={handleReset}> Reset </div>
                    </div>
                </div>
            </form>
        </section>
    )
}

export default AddEditPhase