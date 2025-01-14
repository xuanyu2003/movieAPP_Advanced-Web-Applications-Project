import React, { useState } from 'react'
import"./Register.css"
import { BiSolidCoffee } from "react-icons/bi";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast  from 'react-hot-toast';

function Register() {
    const navigate = useNavigate();
    const url = process.env.REACT_APP_API_URL    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

  const registerUser = async (e) => {
      e.preventDefault();
      if(email === '' || password === '' || confirmPassword === '') {
          alert('All fields are required');
          return;
      }
      if(password !== confirmPassword){
          alert('Password and Confirm Password do not match');
          return;
      }
       // Check for password length
    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
      }
      // Check for at least one uppercase letter in password
    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
      toast.error('Password must contain at least one uppercase letter.');
      return;
    }

      try{
          const response = await axios.post(url + '/user/register',
          {
              users_email: email,
              users_password: password
          },
          {
              headers: {
                  'Content-Type': 'application/json'
              }
          });
          

     // Show success alert
      toast.success('Registration successful! Redirecting to login page.');
           // Redirect to login on success
      navigate('/login');
        }catch(error){
            console.log('error while register: ', error);
        }

  }

  return (
    <div className='Container'>
        <div className='app-container'>
        <div className='app-title'>
            {/* <BiSolidCoffee className='app-logo'/> */}
            <h1>Sign Up!</h1>
        </div>
        <form className='Form'>
            <label className='Label'>Email</label>
            <input onChange={(e)=>setEmail(e.target.value)} className='form-input' type='email' placeholder='Enter Email'/>
            <label className='Label'>Password</label>
            <input onChange={(e)=>setPassword(e.target.value)} className='form-input' type='password' placeholder='Enter Password' />
            <label className='Label'>Confirm Password</label>
            <input onChange={(e)=>setConfirmPassword(e.target.value)} className='form-input' type='password' placeholder='Confirm Password' />
            <button onClick={registerUser} className='btn' type='submit' >Register</button>
            <p>Already have account? 
                <Link to={"/login"}>Sign in</Link>
            </p>
        </form>
        </div>
    </div>
  )
}

export default Register