import "../../../styles/Drawer.css";
import { AccountTree, Add, Close, Save } from '@mui/icons-material'
import { Button, Checkbox, FormControlLabel, IconButton, TextField, Typography } from '@mui/material'
import React from 'react'
import { RippleEffect } from "../../../utilities/ripple";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../config/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../../../redux/slices/snackbar";

const AddEditProcess = (props) => {

    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch();

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            processName: "",
            processDtl: "",
        },
        mode: "onBlur",
        reValidateMode: "onChange",
    });

    React.useEffect(() => {
        if(props.process) reset(props.process)
    }, [props.process])

    const onSubmit = async (data) => {
        // console.log(user)
        // console.log(data);
        data.createdby = user?._id;
        data.status = "Active";
        
        try {
            let id = props?.process?._id
            let url = id ? `/prcss/update?id=${id}` : `/prcss/create`
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
        reset(props.process);
    };

    return (
        <section className="drawer-container">
            <div className="drawer-header">
                <Typography className="title" color="primary">
                    <AccountTree color="primary" style={{ fontSize: "2rem", margin: "-10px 0" }} /> {props.process != null ? 'EDIT PROCESS' : 'ADD PROCESS'}
                </Typography>
                <IconButton onClick={() => props.onClose()}> <Close color="error" width={300} /> </IconButton>
            </div>
            <form className="drawer-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="input-container"> 
                    <TextField label="Process Name" variant="filled" fullWidth 
                        {...register("processName", { required: "Process Name is required" })}
                        error={!!errors.processName} helperText={errors.processName?.message}
                    /> 
                </div>
                <div className="input-container"> 
                    <TextField  label="Process Detail"  variant="filled"  fullWidth  type="text" {...register("processDtl")}
                        error={!!errors.processDtl} helperText={errors.processDtl?.message} /> 
                </div>
                

                <div className="action-buttons">
                    <div style={{padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "1rem"}}>
                        <Button type="submit" variant="contained" size="large">
                            {props.process != null ? "UPDATE":<> ADD <Add style={{ margin: "-3px 0 0 4px" }} /></>} 
                        </Button>
                        
                        <div className="reset-button" onClick={handleReset}> Reset </div>
                    </div>
                </div>
            </form>
        </section>
    )
}

export default AddEditProcess