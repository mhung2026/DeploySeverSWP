import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export default function Doimatkhaudaquen() {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const resetEmail = localStorage.getItem('resetEmail');
    if (resetEmail) {
      setShowResetPassword(true);
    } else {
      // Nếu không tìm thấy resetEmail, chuyển hướng về trang đăng nhập
      navigate('/dangnhap');
    }
  }, [navigate]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const updatedAt = Date.now();
      const data = {
        password: newPassword,
        updatedAt: updatedAt
      };

      const resetEmail = localStorage.getItem('resetEmail');
      if (!resetEmail) {
        toast.error("No reset email found.");
        // Nếu không tìm thấy resetEmail, chuyển hướng về trang đăng nhập
        navigate('/dangnhap');
        return;
      }

      const response = await axios.put(`http://swprealestatev2-001-site1.etempurl.com/api/account/QuenMatKhau/${resetEmail}`, data);
      console.log(response.data);
      toast.success("Đổi mật khẩu thành công");
      localStorage.removeItem('resetEmail');

      setShowRedirectMessage(true);
      setTimeout(() => {
        handleRedirect();
      }, 5000);
    } catch (error) {
      toast.error("An error occurred while resetting password.");
      console.error(error);
    }
  };

  const handleRedirect = () => {
    navigate('/dangnhap');
  };

  return (
    <div>
      {showResetPassword ? (
        <form onSubmit={handlePasswordReset}>
          <p>Nhập mật khẩu mới:</p>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /><br /><br />
          <p>Nhập lại mật khẩu mới:</p>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /><br /><br />
          <button type="submit">Reset Password</button>
        </form>
      ) : (
        <p>No reset email found.</p>
      )}
      {showRedirectMessage && <p style={{ color: 'red' }}>Chuyển hướng đến trang đăng nhập sau 5 giây...</p>}
      <ToastContainer />
    </div>
  )
}
