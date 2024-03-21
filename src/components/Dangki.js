import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormValidation from './FormValidation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CallApi from './CallApi';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/FirebaseConfing';
import {  useLocation } from 'react-router-dom';
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from 'firebase/auth';

export default function Dangki() {
    const [roleId, setRoleId] = useState("");
    const [allAccounts, setAllAccounts] = useState([]);
    const navigate = useNavigate();

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
        diaChi: '',
        roleId: ''
    });

    const handleRoleChange = (e) => {
        const selectedRoleId = e.target.value;
        setRoleId(selectedRoleId);

        setFormData(prevState => ({
            ...prevState,
            roleId: selectedRoleId
        }));
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
    
        if (!formData.taiKhoan || !formData.matKhau || !formData.xacNhanMatKhau || !formData.soDienThoai || !formData.email || !formData.diaChi || !roleId) {
            toast.error('Vui lòng điền đầy đủ thông tin và chọn vai trò!');
            return;
        }
    
        if (formData.matKhau !== formData.xacNhanMatKhau) {
            toast.error('Mật khẩu không khớp!');
            return;
        }
    
        const existingEmail = allAccounts.find(account => account.email === formData.email);
        if (existingEmail) {
            toast.error('Email đã tồn tại!');
            return;
        }
    
        try {
            // Gửi email xác thực
            await sendSignInLinkToEmail(auth, formData.email, {
                url: '/xacthucdangki',
                handleCodeInApp: true,
            });
    
            // Lưu email vào cookie
            Cookies.set('email', formData.email); // Sử dụng cookies để lưu trữ email
    
            // Lưu formData vào localStorage (nếu cần)
            localStorage.setItem('formData', JSON.stringify(formData));
    
            toast.success('Chúng tôi đã gửi một email xác thực đến địa chỉ của bạn!');
            navigate('/kiemtraemail');
        } catch (error) {
            toast.error('Đã quá số lần tạo tài khoản trong ngày, vui lòng chờ ngày mai');
        }
    };

    const [user] = useAuthState(auth);
    const location = useLocation();
    const { search } = location;
    const [initialLoading, setInitialLoading] = useState(false);
    const [initialError, setInitialError] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/');
        } else {
            if (isSignInWithEmailLink(auth, window.location.href)) {
                let email = localStorage.getItem('email');
                if (!email) {
                    email = window.prompt('Vui lòng nhập email của bạn');
                }
                setInitialLoading(true);
                signInWithEmailLink(auth, localStorage.getItem('email'), window.location.href)
                    .then((result) => {
                        localStorage.removeItem('email');
                        setInitialLoading(false);
                        setInitialError('');
                        navigate('/');
                    }).catch((err) => {
                        setInitialLoading(false);
                        setInitialError(err.message);
                        navigate('/login');
                    });
            } else {
                console.log('Nhập email và đăng nhập');
            }
        }
    }, [user, search, navigate]);

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
