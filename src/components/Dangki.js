import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormValidation from './FormValidation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CallApi from './CallApi';

export default function Dangki() {
    const [roleId, setRoleId] = useState("");
    const [allAccounts, setAllAccounts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allAccountResponse = await CallApi.getAllAccount();
                setAllAccounts(allAccountResponse);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const [formData, setFormData] = useState({
        taiKhoan: '',
        matKhau: '',
        xacNhanMatKhau: '',
        soDienThoai: '',
        email: '',
        diaChi: ''
    });

    const handleRoleChange = (e) => {
        setRoleId(e.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!FormValidation.validateFormData(formData) || !roleId) {
            toast.error('Vui lòng kiểm tra lại thông tin đã nhập và chọn vai trò!');
            return;
        }

        const existingEmail = allAccounts.find(account => account.email === formData.email);
        if (existingEmail) {
            toast.error('Email đã tồn tại!');
            return;
        }

        const postData = {
            roleId: roleId,
            username: formData.taiKhoan,
            password: formData.matKhau,
            phoneNumber: formData.soDienThoai,
            email: formData.email,
            address: formData.diaChi,
            createAt: new Date().toISOString(),
            status: true
        };

        try {
            const response = await axios.post('http://swprealestatev2-001-site1.etempurl.com/api/account/TaoTaiKhoan', postData);
            console.log('Đăng ký thành công:', response.data);
            toast.success('Đăng kí thành công!', {
                onClose: () => window.location.href = '/dangnhap'
            });
        } catch (error) {
            console.error('Đăng ký thất bại:', error);
            toast.error('Đăng kí thất bại!');
        }
    };

    return (
        <div class="login-wrap">
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <div class="login-html">
                <input id="tab-1" type="radio" name="tab" class="sign-in" checked /><label for="tab-1" class="tab">Đăng ký</label>
                <form onSubmit={handleSubmit}>
                    <div className="group1">
                        <label htmlFor="email" className="label1">Email:</label>
                        <input type="email" name="email" className='inputtype' value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="group1">
                        <label htmlFor="taiKhoan" className="label1">Họ Và Tên:</label>
                        <input type="text" name="taiKhoan" className='inputtype' value={formData.taiKhoan} onChange={handleChange} required />
                    </div>
                    <div className="group1">
                        <label htmlFor="matKhau" className="label1">Mật khẩu:</label>
                        <input type="password" name="matKhau" className='inputtype' value={formData.matKhau} onChange={handleChange} required />
                    </div>
                    <div className="group1">
                        <label htmlFor="xacNhanMatKhau" className="label1">Xác nhận lại mật khẩu:</label>
                        <input type="password" name="xacNhanMatKhau" className='inputtype' value={formData.xacNhanMatKhau} onChange={handleChange} required />
                    </div>
                    <div className="group1">
                        <label htmlFor="soDienThoai" className="label1">Số điện thoại:</label>
                        <input type="text" name="soDienThoai" className='inputtype' value={formData.soDienThoai} onChange={handleChange} required />
                    </div>
                    <div className="group1">
                        <label htmlFor="diaChi" className="label1">Địa chỉ:</label>
                        <input type="text" name="diaChi" className='inputtype' value={formData.diaChi} onChange={handleChange} required />
                    </div>
                    <div className="roleSelection">
                        <label>
                            <input type="radio" value="3" name="role" checked={roleId === "3"} onChange={handleRoleChange} /> Khách hàng
                        </label>
                        <label style={{ marginLeft: '20px' }}>
                            <input type="radio" value="2" name="role" checked={roleId === "2"} onChange={handleRoleChange} /> Chủ đầu tư
                        </label>
                    </div>
                    <button type="submit" style={{ backgroundColor: "#35CB6D", width: '100%', borderRadius: "50px", border: "1px solid #000" }}>Đăng Ký</button>
                </form>
            </div>
        </div>
    );

}

