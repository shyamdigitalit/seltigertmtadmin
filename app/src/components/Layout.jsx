import "../styles/Layout.css";
// import Logo from "/logo4.png";
import React, { Suspense } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../redux/slices/authSlice"
import { Logout } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { showSnackbar } from "../redux/slices/snackbar";
import Loader from "./loader";


const Header = React.lazy(() => import('./Header'));


export default function MiniDrawer() {
  const location = useLocation();
  const dispatch = useDispatch()
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user);
  const userSymbol = user?.acc_fname?.split(" ")?.map(item => item[0])?.join("");
  const navigate = useNavigate()

  const [openMenu, setOpenMenu] = React.useState({});

  const toggleSubMenu = (menu) => {
    setOpenMenu((prev) => ({
      [menu]: !prev[menu] || false  // open clicked menu, close others
    }));
  };

  const handleLogout = async () => {
    const result = await dispatch(logout());
    // console.log(result);
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(showSnackbar({ message: "Logged Out Successfully", severity: 'info', }));
      navigate('/');
    }
  }

  const handleAction = (text) => () => {
    if(text === 'Logout') {
      handleLogout()
    }
  };  
  
  const sessionMenuData = [
    { title: 'Profile', icon: <Avatar />, onClick: handleAction('Profile') }, // Another simple item
    // { title: 'Settings', icon: <Settings />, onClick: handleAction('Settings') }, // Another simple item
    { title: 'Logout', icon: <Logout />, onClick: handleAction('Logout') }, // Another simple item
  ];


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setOpenMenu({});
  };
  

  return (
    <Box>
      {/* <CssBaseline /> */}
      {isAuthenticated && <>
        <Suspense fallback={<Loader />}> <Header /> </Suspense>
        {/* <div style={{ position: "fixed", left: 0, top: 0, width: "100%", zIndex: 100 }} >
        </div> */}
        
      </>}
      <div style={isAuthenticated ? { marginTop: "5rem", flexGrow: 1, overflowX: "auto" } : {width: "100%"}} >
        <Outlet /> 
      </div>
    </Box>
  );
}

