import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../firebase/FirebaseConfing';
import { sendPasswordResetEmail } from 'firebase/auth';
import CallApi from './CallApi';
export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    useEffect(() => {
        const resetEmail = localStorage.getItem('resetEmail');
        if (resetEmail) {
            setEmail(resetEmail);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailVal = e.target.email.value;
        const allAccounts = await CallApi.getAllAccount();
        const accountExists = allAccounts.some(account => account.email === emailVal);
        if (!accountExists) {
            toast.error("Email không tồn tại.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, emailVal);
            localStorage.setItem('resetEmail', emailVal);
            toast.success("Vui lòng kiểm tra email để đổi mật khẩu.");    
        } catch (error) {
            toast.error(error.code);
        }
    };
    
    return (
        <div className="App">
            <h1>Quên mật khẩu</h1>
            <h2>Nhập email của bạn</h2>
            <form onSubmit={handleSubmit}>
                    <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br /><br />
                    <button type="submit">Reset</button>
                </form>
            <ToastContainer />
        </div>
    );
}
