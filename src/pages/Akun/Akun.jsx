
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    HiOutlineUser, 
    HiOutlineShieldCheck, 
    HiOutlineQuestionMarkCircle, 
    HiOutlineInformationCircle,
    HiOutlineArrowLeftOnRectangle,
    HiOutlineChevronRight,
    HiOutlineEnvelope,
    HiOutlinePhone,
    HiOutlineBell
} from 'react-icons/hi2';
import { getSubscriptionStatus, subscribeUser, unsubscribeUser } from '../../utils/pushNotification';
import { toast } from 'react-hot-toast';
import styles from './Akun.module.css';
import { AuthRepository, GeneralRepository } from '../../repositories';
import logo from '../../assets/images/logo.png';


const Akun = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [settings, setSettings] = useState(null);
    
    // Change Password States
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
    });
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await GeneralRepository.getSettings();
                if (res?.status === 'success') setSettings(res.data);
            } catch (error) {
                console.error('Fetch settings error:', error);
            }
        };
        const checkPush = async () => {
            const status = await getSubscriptionStatus();
            setIsSubscribed(status);
        };
        fetchSettings();
        checkPush();
    }, []);

    const handleToggleNotification = async () => {
        try {
            if (isSubscribed) {
                await unsubscribeUser();
                setIsSubscribed(false);
                toast.success('Notifikasi dimatikan');
            } else {
                await subscribeUser();
                setIsSubscribed(true);
                toast.success('Notifikasi diaktifkan');
            }
        } catch (error) {
            console.error('Push error:', error);
            toast.error('Gagal mengatur notifikasi. Pastikan Anda mengizinkan notifikasi di browser.');
        }
    };

    const handleLogout = async () => {
        try {
            await AuthRepository.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            toast.success('Berhasil keluar');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        
        if (passwordData.new_password !== passwordData.confirm_password) {
            return toast.error('Konfirmasi password tidak cocok');
        }

        if (passwordData.new_password.length < 6) {
            return toast.error('Password baru minimal 6 karakter');
        }

        try {
            setSubmitting(true);
            const res = await AuthRepository.changePassword({
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });

            if (res.status === 'success') {
                toast.success('Password berhasil diubah');
                setShowPasswordModal(false);
                setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
            } else {
                toast.error(res.message || 'Gagal mengubah password');
            }
        } catch (error) {
            console.error('Change password error:', error);
            toast.error(error.response?.data?.message || 'Terjadi kesalahan saat mengubah password');
        } finally {
            setSubmitting(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

    const menuGroups = [
        {
            title: 'Pengaturan Akun',
            items: [
                { id: 'profile', label: 'Edit Profil', icon: <HiOutlineUser />, path: '/profile', comingSoon: true },
                { id: 'notification', label: 'Notifikasi Push', icon: <HiOutlineBell />, action: handleToggleNotification, toggle: true, active: isSubscribed },
                { id: 'password', label: 'Ubah Password', icon: <HiOutlineShieldCheck />, action: () => setShowPasswordModal(true) },
            ]
        },
        {
            title: 'Dukungan',
            items: [
                { id: 'help', label: 'Pusat Bantuan', icon: <HiOutlineQuestionMarkCircle />, path: '/help', comingSoon: true },
                { id: 'about', label: 'Tentang Aplikasi', icon: <HiOutlineInformationCircle />, path: '/about', comingSoon: true },
            ]
        }
    ];

    return (
        <div className={styles.container}>
            {/* Top Section */}
            <div className={styles.topSection}>
                {settings?.background_login && (
                    <div className={styles.bgOverlay}>
                        <img src={settings.background_login} alt="Background" className={styles.bgImage} />
                        <div className={styles.bgGradient}></div>
                    </div>
                )}
                
                <div className={styles.header}>
                    <div className={styles.brandWrapper}>
                        <img src={logo} alt="Logo" className={styles.logo} />
                        <span className={styles.brandName}>SIPORTU</span>
                    </div>
                </div>

                <div className={styles.pageTitleWrapper}>
                    <h1 className={styles.pageTitle}>Akun Saya</h1>
                </div>
            </div>

            {/* Profile Card */}
            <div className={styles.profileSection}>
                <div className={styles.profileCard}>
                    <div className={styles.profileMain}>
                        <div className={styles.avatarWrapper}>
                            <div className={styles.avatar}>
                                {getInitials(user.name)}
                            </div>
                        </div>
                        <div className={styles.userInfo}>
                            <h2 className={styles.userName}>{user.name || 'Pengguna'}</h2>
                            <p className={styles.userRole}>Orang Tua / Wali</p>
                        </div>
                    </div>
                    
                    <div className={styles.userContact}>
                        <div className={styles.contactItem}>
                            <HiOutlineEnvelope className={styles.contactIcon} />
                            <span>{user.email || 'user@example.com'}</span>
                        </div>
                        <div className={styles.contactItem}>
                            <HiOutlinePhone className={styles.contactIcon} />
                            <span>{user.phone || '-'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Sections */}
            <div className={styles.content}>
                {menuGroups.map((group, idx) => (
                    <div key={idx} className={styles.menuGroup}>
                        <h3 className={styles.groupTitle}>{group.title}</h3>
                        <div className={styles.menuList}>
                            {group.items.map((item) => {
                                const isDisabled = item.comingSoon;
                                return (
                                    <div 
                                        key={item.id} 
                                        className={`${styles.menuItem} ${isDisabled ? styles.menuItemDisabled : ''}`} 
                                        onClick={isDisabled ? undefined : (item.action || (() => navigate(item.path)))}
                                    >
                                        <div className={styles.menuItemLeft}>
                                            <div className={styles.menuIconWrapper}>
                                                {item.icon}
                                            </div>
                                            <span className={styles.menuLabel}>{item.label}</span>
                                        </div>
                                        {item.toggle ? (
                                            <div className={`${styles.toggle} ${item.active ? styles.toggleActive : ''}`}>
                                                <div className={styles.toggleCircle}></div>
                                            </div>
                                        ) : isDisabled ? (
                                            <span className={styles.comingSoonBadge}>Soon</span>
                                        ) : (
                                            <HiOutlineChevronRight className={styles.chevron} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <button className={styles.logoutButton} onClick={handleLogout}>
                    <div className={styles.logoutIconWrapper}>
                        <HiOutlineArrowLeftOnRectangle />
                    </div>
                    <span>Keluar dari Aplikasi</span>
                </button>
                
                <div className={styles.versionInfo}>
                    <span>Versi 2.0.0</span>
                </div>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalHeader}>
                            <h2>Ubah Password</h2>
                            <button onClick={() => setShowPasswordModal(false)} className={styles.closeBtn}>&times;</button>
                        </div>
                        <form onSubmit={handleChangePassword}>
                            <div className={styles.modalBody}>
                                <div className={styles.formGroup}>
                                    <label>Password Lama</label>
                                    <input 
                                        type="password" 
                                        placeholder="Masukkan password saat ini"
                                        required
                                        value={passwordData.old_password}
                                        onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Password Baru</label>
                                    <input 
                                        type="password" 
                                        placeholder="Minimal 6 karakter"
                                        required
                                        value={passwordData.new_password}
                                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Konfirmasi Password Baru</label>
                                    <input 
                                        type="password" 
                                        placeholder="Ulangi password baru"
                                        required
                                        value={passwordData.confirm_password}
                                        onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.btnCancel} onClick={() => setShowPasswordModal(false)}>Batal</button>
                                <button type="submit" className={styles.btnSubmit} disabled={submitting}>
                                    {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Akun;

