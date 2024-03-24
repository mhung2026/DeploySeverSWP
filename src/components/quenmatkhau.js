import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import hook useNavigate
import { auth } from '../firebase/FirebaseConfing';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPassword() {
    const navigate = useNavigate(); // Initialize useNavigate
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showRedirectMessage, setShowRedirectMessage] = useState(false); // State to control the display of the redirection message

    useEffect(() => {
        localStorage.clear();
        const resetEmail = localStorage.getItem('resetEmail');
        if (resetEmail) {
            setEmail(resetEmail);
            setShowResetPassword(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailVal = e.target.email.value;

        try {
            await sendPasswordResetEmail(auth, emailVal);
            localStorage.setItem('resetEmail', emailVal);
            toast.success("Check your email for password reset instructions.");
            setShowResetPassword(true);
        } catch (error) {
            toast.error(error.code);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        // Kiểm tra mật khẩu nhập lại có khớp với mật khẩu mới không
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const currentDate = new Date().toISOString();
            const data = {
                password: newPassword,
                updateAt: currentDate
            };

            const response = await axios.put(`http://swprealestatev2-001-site1.etempurl.com/api/account/QuenMatKhau/${email}`, data);
            // Xử lý kết quả trả về nếu cần
            console.log(response.data);
            toast.success("Password reset successful.");
            // Xóa dữ liệu trong localStorage
            localStorage.removeItem('resetEmail');
            // Hiển thị thông báo và chuyển hướng sau 5 giây
            setShowRedirectMessage(true);
            setTimeout(() => {
                navigate('/dangnhap');
            }, 5000);
        } catch (error) {
            toast.error("An error occurred while resetting password.");
            console.error(error);
        }
    };

    return (
        <div className="App">
            <h1>Forgot Password</h1>
            {showResetPassword ? (
                <div>
                    <form onSubmit={handlePasswordReset}>
                        <p>Nhập mật khẩu mới:</p>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /><br /><br />
                        <p>Nhập lại mật khẩu mới:</p>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /><br /><br />
                        <button type="submit">Reset Password</button>
                    </form>
                    {showRedirectMessage && <p style={{ color: 'red' }}>Chuyển hướng đến trang đăng nhập sau 5 giây...</p>}
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br /><br />
                    <button type="submit">Reset</button>
                </form>
            )}
            <ToastContainer />
        </div>
    );
}
