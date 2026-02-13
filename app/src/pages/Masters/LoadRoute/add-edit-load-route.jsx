import "../../../styles/Drawer.css";
import { AccountTree, Add, Close, Save } from '@mui/icons-material'
import { Button, Checkbox, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React from 'react'
import { RippleEffect } from "../../../utilities/ripple";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../config/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../../../redux/slices/snackbar";

const AddEditLoadRoute = (props) => {

    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch();

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            phase: "",
            loadrouteCode: "",
            loadrouteDesc: "",
        },
        mode: "onBlur",
        reValidateMode: "onChange",
    });

    const [phaseList, setPhaseList] = React.useState([])

    React.useEffect(() => {
        if(props.loadRoute) reset(props.loadRoute)
    }, [props.loadRoute])


    React.useEffect(() => {
        getPhaseList();
    }, [])


    const getPhaseList = async () => {
        try {
            const result = await axiosInstance.get(`/phs/fetch`).then(res => res.data)
            if(result.statuscode == 202) {
                setPhaseList(result.data)
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
            let id = props?.loadRoute?._id
            let url = id ? `/loadroute/update?id=${id}` : `/loadroute/create`
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
                    <AccountTree color="primary" style={{ fontSize: "2rem", margin: "-10px 0" }} /> {props?.loadRoute ? "UPDATE":"ADD"} PHASE
                </Typography>
                <IconButton onClick={() => props.onClose()}> <Close color="error" width={300} /> </IconButton>
            </div>
            <form className="drawer-form" onSubmit={handleSubmit(onSubmit)}>

                <div className="input-container">
                    {!!phaseList.length && <FormControl variant="filled" fullWidth error={!!errors.phase}>
                        <InputLabel id="phase-label">Phase</InputLabel>
                        <Select labelId="phase-label" id="phase" defaultValue={props?.loadRoute?.phase}
                            {...register("phase", { required: "Phase is required" })}
                            MenuProps={{ PaperProps: { style: { maxHeight: 200, }, }, }}
                        >
                            <MenuItem value=""> <em>Select</em> </MenuItem>
                                {phaseList.map((phase) => (
                                    <MenuItem key={phase._id} value={phase._id}>
                                        {phase.phaseName}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>}
                </div>
                <div className="input-container"> 
                    <TextField label="Load Route Code" variant="filled" fullWidth 
                        {...register("loadrouteCode", { required: "Load Route Code is required" })}
                        error={!!errors.loadrouteCode} helperText={errors.loadrouteCode?.message}
                    /> 
                </div>
                <div className="input-container"> 
                    <TextField  label="Load Route Desc"  variant="filled"  fullWidth  type="text" {...register("loadrouteDesc")}
                        error={!!errors.loadrouteDesc} helperText={errors.loadrouteDesc?.message} /> 
                </div>
                

                <div className="action-buttons">
                    <div style={{padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "1rem"}}>
                        <Button type="submit" variant="contained" size="large">
                            {props?.loadRoute ? "UPDATE":<> ADD <Add style={{ margin: "-3px 0 0 4px" }} /></>} 
                        </Button>
                        
                        <div className="reset-button" onClick={handleReset}> Reset </div>
                    </div>
                </div>
            </form>
        </section>
    )
}

export default AddEditLoadRoute