import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; 
export default function XacThucDangKi() {
    const formData = JSON.parse(localStorage.getItem('formData'));
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [verifiedEmail, setVerifiedEmail] = useState('');

    useEffect(() => {
        const submitData = async () => {
            try {
                // Tạo một biến để lưu dữ liệu cần gửi đi
                const postData = {
                    roleId: formData.roleId,
                    username: formData.taiKhoan,
                    password: formData.matKhau,
                    phoneNumber: formData.soDienThoai,
                    email: formData.email,
                    address:formData.diaChi,
                    createAt: new Date().toISOString(),
                    status: true,
                };
    
                // Ghi console giá trị của biến postData
                console.log('Dữ liệu gửi đi:', postData);
    
                // Gửi dữ liệu đến máy chủ và chờ phản hồi
                const response = await axios.post('http://swprealestatev2-001-site1.etempurl.com/api/account/TaoTaiKhoan', postData);
    
                console.log(response.data); // In phản hồi từ server sau khi gửi dữ liệu thành công
    
                // Xác thực email thành công
                setMessage('Xác thực email thành công, Chuyen huong sau 6 giay...');
                setVerifiedEmail(Cookies.get('email')); // Lấy email từ cookies
                // Chuyển hướng sau 3 giây
                setTimeout(() => {
                    navigate('/trangchu');
                }, 6000);
            } catch (error) {
                console.error('Lỗi khi gửi dữ liệu:', error);
                // Ghi ra lỗi khi gửi dữ liệu không thành công
                setMessage('Có lỗi xảy ra khi xác thực email');
            }
            localStorage.removeItem('formData');
            // Không cần xóa email khỏi cookies, nếu bạn muốn giữ
        };
    
        submitData();
    }, [formData, navigate]);
    

    return (
        <div>
          
            <h2> Đang xác thực Email: {verifiedEmail}</h2> {/* Hiển thị email đã xác thực */}
            <p>{message}</p>
            {formData && (
                <div>
                    {/* <p>Họ và tên: {formData.taiKhoan}</p>
                    <p>Mật khẩu: {formData.matKhau}</p>
                    <p>Xác nhận mật khẩu: {formData.xacNhanMatKhau}</p>
                    <p>Số điện thoại: {formData.soDienThoai}</p>
                    <p>Địa chỉ: {formData.diaChi}</p>
                    <p>Địa chỉ: {formData.roleId}</p> */}
                 
                </div>
            )}
        </div>
    );
}