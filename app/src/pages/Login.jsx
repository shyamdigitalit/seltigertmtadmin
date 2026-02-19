import '../styles/Login.css'
import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material'
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { showSnackbar } from '../redux/slices/snackbar';


const Login = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);
  const [credentials, setCredentials] = useState({ accountEmail: '', accountPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlechange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  const handlesubmit = async () => {
    try {
      const result = await dispatch(login(credentials));
      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(showSnackbar({ message: "Logged In Successfully", severity: 'success', }));
        navigate('/');
      }else {
        dispatch(showSnackbar({ message: result.payload, severity: 'error', }));
      }
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <section className="login-container">
      <div className="wrapper"></div>
      <div></div>
      <div className="image-container">
        {/* <img src="https://thumbs.dreamstime.com/b/multi-factor-authentication-illustration-mfa-vector-editable-297401593.jpg" width={"100%"} alt=""/> */}
        {/* <img src="/logo3.png" width={"100%"} alt="" /> */}
        <img src="/login.gif" width={"100%"} alt="" />
      </div>
      <div className="login-form">
        <img src="./shyamlogo.png" width={100} alt=""/>
        <h1 className="login-title">Authentication</h1>
        <TextField className="text-field" label="Email Id / Username" variant="filled" fullWidth
          name="accountEmail"
          value={credentials.accountEmail}
          onChange={handlechange}
        />

        <TextField className="text-field" label="Password" variant="filled" fullWidth
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <div onClick={handleTogglePasswordVisibility} style={{marginBottom: "-10px", cursor: "pointer"}}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            ),
          }}
          name="accountPassword"
          value={credentials.accountPassword}
          onChange={handlechange}
        />


        <FormControlLabel checked control={<Checkbox />} label="Remember Me" />

        <div>
          <a className="forgot-password" href="">Forgot Password ?</a>
        </div>

        <Button size="large" variant="contained" disabled={loading} onClick={handlesubmit}>Login</Button>
        
      </div>
    </section>
    
  )
}

export default Login