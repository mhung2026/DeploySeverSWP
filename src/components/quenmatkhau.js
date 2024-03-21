import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/FirebaseConfing';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPassword() {
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailVal = e.target.email.value;
        
        try {
            await sendPasswordResetEmail(auth, emailVal);
            alert("Check your email for password reset instructions.");
           
        } catch (error) {
            alert(error.code);
        }
    };

    return (
        <div className="App">
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <input name="email" /><br/><br/>
                <button type="submit">Reset</button>
            </form>
        </div>
    );
}