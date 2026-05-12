import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import AuthLayout from '@/components/layout/AuthLayout/AuthLayout';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import { AuthRepository } from '@/repositories';

import styles from './Register.module.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        nik: '',
        password: '',
        password_confirmation: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

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
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Nama lengkap wajib diisi';
        if (!formData.email) newErrors.email = 'Email wajib diisi';
        if (!formData.nik) newErrors.nik = 'NIK wajib diisi';
        if (!formData.password) newErrors.password = 'Kata sandi wajib diisi';
        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Kata sandi tidak cocok';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Mohon periksa kembali formulir anda');
            return;
        }

        setLoading(true);
        try {
            const response = await AuthRepository.registerOrangtua(formData);

            if (response.success) {
                toast.success('Registrasi berhasil! Silakan masuk.');
                // Optionally auto-login or redirect to login
                navigate('/login');
            } else {
                toast.error(response.message || 'Registrasi gagal');
            }
        } catch (error) {
            console.error('Registration error:', error);
            const status = error.response?.status;
            let message = 'Terjadi kesalahan saat registrasi';

            if (status === 404) {
                message = 'NIK tidak ditemukan pada data siswa';
            } else if (status === 409) {
                message = 'Email atau NIK sudah terdaftar';
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            }

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Daftar Akun"
            subtitle="Buat Akun Baru"
            description="Lengkapi data diri anda untuk mendaftar"
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                    label="Nama Lengkap"
                    name="name"
                    placeholder="Nama Lengkap Anda"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                />

                <Input
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                />

                <Input
                    label="NIK"
                    name="nik"
                    placeholder="Nomor Induk Kependudukan"
                    value={formData.nik}
                    onChange={handleChange}
                    error={errors.nik}
                    type="number"
                />

                <Input
                    label="Kata Sandi"
                    type="password"
                    name="password"
                    placeholder="Minimal 8 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                />

                <Input
                    label="Konfirmasi Kata Sandi"
                    type="password"
                    name="password_confirmation"
                    placeholder="Ulangi kata sandi"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    error={errors.password_confirmation}
                />

                <div style={{ marginTop: '20px' }}>
                    <Button type="submit" variant="primary">
                        {loading ? 'Memproses...' : 'Daftar Sekarang'}
                    </Button>
                </div>

                <div className={styles.loginLink}>
                    Sudah punya akun? <Link to="/login">Masuk disini</Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Register;
