import "../../../styles/InspectionEntryForm.css";
import React, { Suspense } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import DeleteIcon from '@mui/icons-material/Delete';

import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography, IconButton, Card, CardContent, Breadcrumbs, Drawer } from '@mui/material';
import { Link } from "react-router-dom";
import { AccountTree } from "@mui/icons-material";
import { DataGridStyle } from "../../../utilities/datagridStyle";
import axiosInstance from '../../../config/axiosInstance'
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../redux/slices/snackbar";
import Loader from "../../../components/loader";
const AddEditLoadRoute = React.lazy(() => import("./add-edit-load-route"));

const TableHeaderFormat = (props) => {
 
  return [
    { 
      field: 'id', headerName: 'ID', width: 80,
      renderCell: (params) => {
        return params.api.getRowIndexRelativeToVisibleRows(params.id) + 1 + (props.currentPage * props.pageSize);
      },  
    },
    { field: 'phaseName', headerName: 'Phase', width: 120 },
    { field: 'loadrouteCode', headerName: 'Load Route Code', width: 160 },
    { field: 'loadrouteDesc', headerName: 'Load Route Desc', width: 160 },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'createdOn', headerName: 'Created On', width: 100 },
    { field: 'updatedOn', headerName: 'Updated On', width: 100 },
  ]
}


export default function LoadRoute() {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false)
  const [loadRouteList , setLoadRouteList] = React.useState([])
  const [currentPage, setCurrentPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(1)
  const [rowSelectionModel, setRowSelectionModel] = React.useState({ type: "include", ids: new Set() });
  const [selectedRows, setSelectedRows] = React.useState([])
  const [selectedLoadRoute, setSelectedLoadRoute] = React.useState(null)

  React.useEffect(() => {
    getLoadRouteList();
  }, [])

  
  React.useEffect(() => {
    if(selectedRows.length === 1){
      const selected = loadRouteList.find(item => item._id === selectedRows[0])
      setSelectedLoadRoute(selected)
    }
  }, [selectedRows])

  const getLoadRouteList = async () => {
    try {
      const result = await axiosInstance.get(`/loadroute/fetch`).then(res => res.data)
      if(result.statuscode == 202) {
        setLoadRouteList(result.data)
        // dispatch(showSnackbar({ message: result.message, severity: 'info', duration: 2000}));
      }
    } catch (error) {
      console.error(error)
    }
  }

  const deleteLoadRoute = async () => {
    try {
      const result = await axiosInstance.put(`/loadroute/removeall`, selectedRows).then(res => res.data)
      console.log(result)
      if(result.statuscode == 201) {
        getLoadRouteList();
        dispatch(showSnackbar({ message: result.message, severity: 'warning', duration: 2000}));
      }else{
        dispatch(showSnackbar({ message: result.message, severity: 'error', duration: 2000}));
      }
    } catch (error) {
      dispatch(showSnackbar({ message: error.message, severity: 'error', duration: 2000}));
    }
  }

  const handleClose = () => {
    setOpen(false);
    setRowSelectionModel({ type: "include", ids: new Set() })
    setSelectedRows([])
    getLoadRouteList();
  }

  return (
    <section className="inspection-entry-form">
        
        <Drawer anchor={"right"} open={open} onClose={() => handleClose()} PaperProps={{ style: { width: 600 } }}> 
          <Suspense fallback={<Loader />}>
            <AddEditLoadRoute loadRoute={selectedLoadRoute} onClose={handleClose} /> 
          </Suspense>
        </Drawer>
 
        <Breadcrumbs aria-label="breadcrumb" style={{marginBottom: "1rem"}}>
          <Link underline="hover" color="inherit" href="/"> Masters </Link>
          <Typography sx={{ color: 'text.primary' }}>LoadRoute</Typography>
        </Breadcrumbs>

        <Typography className="title" color="primary">
            <AccountTree color="primary" style={{ fontSize: "3rem", margin: "-10px 0" }} /> LoadRoute
        </Typography>

        <div className="button-container">
            <Button variant="outlined" size="large" className="button-css" onClick={() => {
                setSelectedLoadRoute(null)
                setSelectedRows([])
                setOpen(true)
            }}>
                Add New <AddIcon style={{ margin: "-1px 0 0 2px", fontSize: 17, fontWeight: 600 }} />
            </Button>
            <IconButton onClick={() => setOpen(true)}> <EditSquareIcon color={selectedRows.length === 1 ? "info" : "disabled"} /> </IconButton>
            <IconButton onClick={() => deleteLoadRoute()}> <DeleteIcon color={!!selectedRows.length ? "error" : "disabled"} /> </IconButton>
        </div>
        
        <Card>
            <CardContent style={{ padding: "0px" }}>
                <DataGrid sx={DataGridStyle} rows={loadRouteList} columns={TableHeaderFormat({currentPage, pageSize})} getRowId={row => row._id}
                  pageSizeOptions={[5]} checkboxSelection disableRowSelectionOnClick
                  initialState={{ pagination: { paginationModel: { pageSize: 5, }, }, }} 
                  rowSelectionModel={rowSelectionModel}
                  onRowSelectionModelChange={event => {
                    // console.log(event)
                    setRowSelectionModel(event);
                    const ids = loadRouteList.map((row) => row._id);
                    const selectedIDs = ids.filter((id) => event.type == "include" ? [...event.ids].includes(id) : ![...event.ids].includes(id));
                    // console.log(selectedIDs)
                    setSelectedRows(selectedIDs)
                  }}
                  onPaginationModelChange={(e) => {
                    setCurrentPage(e.page)
                    setPageSize(e.pageSize)
                  }}
                />
            </CardContent>
        </Card>
    </section>
  );
}
