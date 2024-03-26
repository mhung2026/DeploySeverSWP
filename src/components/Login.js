import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../authentication/Auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { Padding } from '@mui/icons-material';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            const userLoginBasicInformationDto = JSON.parse(localStorage.getItem('userLoginBasicInformationDto'));
            if (userLoginBasicInformationDto && userLoginBasicInformationDto.roleName === 'Admin') {
            navigate('/admin-trangchu');
            } else {
            navigate('/trangchu');
            }
        }
        }, [navigate]);

    const handleLogin = async () => {
        try {
            setLoading(true);
            if (!username || !password) {
                toast.error('Vui lòng nhập tài khoản và mật khẩu');
                setLoading(false);
                return;
            }
    
            const response = await axios.post(
                'http://swprealestatev2-001-site1.etempurl.com/api/account/login',
                {
                    email: username,
                    password: password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json-patch+json',
                        'accept': '*/*',
                    },
                }
            );
    
            const { accessToken, userLoginBasicInformationDto } = response.data;
            // Lưu thông tin vào localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('userLoginBasicInformationDto', JSON.stringify(userLoginBasicInformationDto));
            // Lưu token vào Auth
            saveToken(accessToken);
            console.log('Login successful. Token:', accessToken);
    
            window.location.reload();
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 401) {
                toast.error('Tài khoản hoặc mật khẩu không đúng');
            } else {
                console.error('Login failed:', error.message);
                toast.error('Tài khoản hoặc mật khẩu không đúng');
            }
        }
    };
    
    

    return (
        <div className="login-wrap">
            <div className="form_login">
                <div className="login">
                    <p>ĐĂNG NHẬP</p>
                    <div className="label">
                        <Form.Floating className="mb-3">
                            <Form.Control
                                id="floatingInputCustom"
                                type="email"
                                placeholder="name@example.com"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}

                            />
                            <label htmlFor="floatingInputCustom">
                                Email
                            </label>
                        </Form.Floating>
                        <Form.Floating>
                            <Form.Control
                                id="floatingPasswordCustom"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="floatingPasswordCustom">
                                Mật khẩu
                            </label>
                        </Form.Floating>
                    </div>

                    <div className="btn-sign">
                    <button type="button" class="btn btn-outline-success" onClick={handleLogin} disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}</button>
                    </div>
                    <div className="Load_create">
                        <p>Bạn chưa có tài khoản?</p>
                        <Link to="/Dangki">
                        <a className='dangki' href=''>Đăng ký</a>
                        </Link>
                    </div>
                </div>
                </div>

            <ToastContainer /> {/* Container để hiển thị thông báo */}
        </div>
    );
};

export default Login;
