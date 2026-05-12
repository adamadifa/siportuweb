import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaLock } from 'react-icons/fa';

import AuthLayout from '@/components/layout/AuthLayout/AuthLayout';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import InstallPrompt from '@/components/PWA/InstallPrompt';
import { AuthRepository, GeneralRepository } from '@/repositories';

import styles from './Login.module.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [settings, setSettings] = useState(null);

    // Fetch Settings
    React.useEffect(() => {
        const fetchSettings = async () => {
            const response = await GeneralRepository.getSettings();
            if (response.status === 'success' && response.data) {
                setSettings(response.data);
            }
        };
        fetchSettings();
    }, []);

    // Redirect if already logged in
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email tidak boleh kosong';
        }
        if (!formData.password) {
            newErrors.password = 'Kata sandi tidak boleh kosong';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Mohon lengkapi formulir');
            return;
        }

        setLoading(true);
        try {
            const response = await AuthRepository.login(formData);

            if (response.success && response.data) {
                // Save token and user data
                localStorage.setItem('token', response.data.token);
                if (response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }

                toast.success('Login berhasil! Selamat datang.');
                // Navigate to dashboard
                navigate('/dashboard');
            } else {
                toast.error(response.message || 'Login gagal');
            }
        } catch (error) {
            console.error('Login failed:', error);
            // Handle error response from API if available
            const message = error.response?.data?.message || 'Email atau password salah';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="SIPORTU"
            subtitle="Selamat Datang"
            description="Sistem Informasi Pesantren Untuk Orangtua"
            logo={settings?.logo}
            background={settings?.background_login}
        >
            <InstallPrompt />
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    type="email"
                    name="email"
                    placeholder="Alamat Email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    leftIcon={FaEnvelope}
                />

                <Input
                    type="password"
                    name="password"
                    placeholder="Kata Sandi"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    leftIcon={FaLock}
                />

                <div style={{ marginTop: '10px' }}>
                    <Button type="submit" variant="primary">
                        {loading ? 'Masuk...' : 'Masuk'}
                    </Button>
                </div>

                <div className={styles.forgotPassword}>
                    <a href="#">Lupa kata sandi?</a>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;
