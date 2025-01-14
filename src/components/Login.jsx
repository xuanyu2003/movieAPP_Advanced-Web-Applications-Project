import React, { useState } from 'react'
import"./Login.css"
import { BiSolidCoffee } from "react-icons/bi";
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import toast from 'react-hot-toast';

const url = process.env.REACT_APP_API_URL
function Login() {

    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const refreshToken = async () => {
        
        try {
          const res = await axios.post(url + "/user/refresh", { token: user.refreshToken });
          
          setUser({
            ...user,
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
          });
            sessionStorage.setItem('user', JSON.stringify({
                ...user,
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
            }));
          return res.data;
        } catch (err) {
          console.log(err);
        }
      };

      const axiosJWT = axios.create()
    
      axiosJWT.interceptors.request.use(
        async (config) => {
          let currentDate = new Date();
          const decodedToken = jwtDecode(user.accessToken);
          if (decodedToken.exp * 1000 < currentDate.getTime()) {
            const data = await refreshToken();
            
            config.headers["authorization"] = "Bearer " + data.accessToken;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    

    const loginUser = async (e) => {
        e.preventDefault();
        if(email === '' || password === '') {
            toast.error('All fields are required');
            return;
        }
        try{
            const response = await axios.post( url +'/user/login',
            {
                users_email: email,
                users_password: password
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            setUser(response.data);
            // set session storage
            sessionStorage.setItem('user', JSON.stringify(response.data));
            // Navigate to the home spage
            navigate('/');
        }catch(error){
            console.log('error while login: ', error);
            // Check if error response exists and show the message
        if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);
        } else {
            toast.error('password is incorrect');
        }
        }
    }

  return (
    <div className='Container'>
        <div className='app-container'>
        <div className='app-title'>
            {/* <BiSolidCoffee className='app-logo'/> */}
            <h1>Sign In!</h1>
        </div>
        <form className='Form'>
            <label className='Label'>Email</label>
            <input onChange={ (e) => setEmail(e.target.value) } className='form-input' type='email' placeholder='Enter Email'/>
            <label className='Label'>Password</label>
            <input onChange={ (e) => setPassword(e.target.value) } className='form-input' type='password' placeholder='Enter Password' />
            <p id='forgot-password'>
                <Link to={"/ResetPassword"}>Forgot password?</Link>
            </p>
            <button onClick={loginUser} className='btn' type='submit' >Login</button>
            <p>No Account? 
                <Link to={"/register"}>Register</Link>  
            </p>
        </form>
     </div>
    </div>
  )
}

export default Login